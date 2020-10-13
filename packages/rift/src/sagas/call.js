/* global fetch */

import {
	all,
	call,
	delay,
	put,
	putResolve,
	take,
	takeLatest,
	takeEvery,
	actionChannel,
	select,
	fork,
	cancel,
	cancelled,
	spawn
} from 'redux-saga/effects';
import { eventChannel, runSaga } from 'redux-saga';
import { originLink } from '../core/utils';
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch';

import * as Actions from '@actions';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
import * as GqlGroups from '@core/api/graphql/groups';

let mediaStreamConstraints = {
	audio: true,
	video: false
};
const {
	ADD_CANDIDATE,
	SEND_CANDIDATE,
	SEND_OFFER,
	GOT_MESSAGE,
	ANSWER_INCOMING,
	START_CALL,
	END_CALL,
	END_CONNECTION,
	setConstraints,
	sendOffer
} = Actions;

import io from 'socket.io-client';
import { queuedUsers } from '../selectors/users';
const onError = e => {
	console.log(e);
	debugger; //error
};

const nsp = 'call';
const socketServerURL = originLink(nsp); //`http://localhost:8080/${nsp}`;

let socket;

const connect = () => {
	socket = io(socketServerURL);
	return new Promise(resolve => {
		socket.on('connect', () => {
			resolve(socket);
		});
	});
};

const createSocketChannel = socket =>
	eventChannel(emit => {
		const handler = (data, secondArg) => {
			console.log('emitting message from socketchannel');
			let msg = { message: data }; //from: this._id };
			console.log('got message handler', msg);
			if (secondArg) {
				const { constraints, users, from } = secondArg;
				msg = { ...msg, ...secondArg };
			}
			emit(msg);
		};
		const onCandidateHandler = candidate => {
			put({ type: ADD_CANDIDATE, candidate });
		};
		socket.on('message', handler);
		socket.on('disconnect', reason => {
			console.log('disconnected');
			socket.connect();
		});
		return () => {
			//socket.off('login', handler);
		};
	});
function* socketListener() {
	const socket = yield call(connect);
	const socketChannel = yield call(createSocketChannel, socket);
	console.log('created call socket channel');
	while (true) {
		const { message, constraints, users, from, signature, call_id } = yield take(socketChannel);
		try {
			yield put({ type: GOT_MESSAGE, message, opts: { call_id, constraints, users, from, signature }});
		} catch (e) {
			console.log('Call Saga Error', e);
		} finally {
			if (yield cancelled()) {
				console.log('cancelled call socket');
				socketChannel.close();
			}
		}
	}
}
function* startSocketSaga() {
	const task = yield fork(socketListener);
	const restart = yield take(Actions.CLOSE_USER_SOCKET);
	yield cancel(task);
	if (restart) {
		const newTask = yield fork(socketListener);
		yield take(Actions.CLOSE_USER_SOCKET);
		yield cancel(newTask);
	} else {
		while (yield take(Actions.START_USER_SOCKET)) {
			const newTask = yield fork(socketListener);
			yield take(Actions.CLOSE_USER_SOCKET);
			yield cancel(newTask);
		}
	}
}

function* addTracks(conn_id, stream) {
	const tracks = stream.getTracks();
	for (i = 0; i < tracks.length; i++) {
		yield put(Actions.peerAction(conn_id, 'addTrack', tracks[i], stream));
	}
}
function* startCallSaga({ id, payload }) {
	const { type, user, mediaStream, dimensions } = payload;
	const constraints = {
		audio: true,
		video: type == 'video' ? dimensions : false
	};
	try {
		let stream;
		if (mediaStream) {
			stream = mediaStream;
		} else {
			// give full video to receiver / request custom resolution from reciever
			let sendConstraints = { audio: true, video: type == 'video' };
			stream = yield call(getUserMediaStream, sendConstraints);
		}

		// R
		let users = yield call(getUsers, user);
		for (let i = 0; i < users.length; i++) {
			const conn_id = users[i].id;
			yield call(addTracks, conn_id, stream);
		}
		yield put(sendOffer({ id, users, constraints }));
	} catch (err) {
		console.log(err);
		debugger; //error
	}
}

function* getUsers(user) {
	let users;
	const userId = user?.id || user?.id;
	if (userId) {
		users = [user];
	} else {
		const checked = yield select(queuedUsers);
		users = Object.keys(checked).map(id => ({ id, ...checked[id] }));
	}
	return users;
}
function* sendOfferSaga({ constraints, offerOptions, users }) {
	try {
		console.log('Sending offer');
		// const usersAndSelf = users.push()
		let signature;
		let call_id;
		for (let i = 0; i < users.length; i++) {
			const user = users[i];
			const conn_id = users[i].id;
			yield put(Actions.peerAction(conn_id, 'createOffer', offerOptions));
			const { payload: offer } = yield take('PEER_ACTION_DONE');
			yield put(Actions.peerAction(conn_id, 'setLocalDescription', offer));
			yield take('PEER_ACTION_DONE');
			const existingConnection = yield select(CallSelectors.connectionById, user);
			if (!existingConnection) {
				if (!signature) {
					signature = yield call(GqlGroups.genCallSignature);
					debugger; //remove
					call_id = signature.call_id;
				}
				if (!call_id) call_id = signature.call_id;
				
				yield put(Actions.addConnection(conn_id, constraints, { offer_sent: true, call_id, signature}));
	
			} else {
				yield put(Actions.editConnection(conn_id, { offer_sent: true }));
			}
			socket.emit('message', offer, { constraints, users, signature, call_id });

			yield put(Actions.removeFromCall({ id: conn_id }));
		}
	} catch (e) {
		debugger; //remove
		console.log(e);
		console.log('error', e);
		debugger; //remove
	}
	
}
function* sendOffersForCall({ call_id }) {
	const users = yield select(CallSelectors.connectionsByCallId, { call_id, onlyNeedsOffer: true });
	const call_metadata = yield select(CallSelectors.callById, { call_id });
	const constraints = call_metadata?.constraints;
	yield put(sendOffer({ users, constraints }));
}
function* getUserMediaStream(constraints) {
	console.log('START', 'getting usermedia');
	const stream = yield putResolve(Actions.getUserMedia(constraints));
	return stream;
}

function* gotMessageSaga({ message, opts }) {
	const { constraints, from, users, call_id, signature } = opts;
	console.log('GOT_MESSAGE', message, opts);
	const conn_id = from.id;
	if (message.type == 'offer') {
		const existing = yield select(CallSelectors.connectionById, from);
		if (existing?.active == true) return;
		if (existing && existing?.incoming && existing?.call_id == call_id) return;
		yield put(Actions.setIncomingConnection(conn_id, constraints, { call_id, signature }));
		yield put(
			Actions.peerAction(
				conn_id,
				'setRemoteDescription',
				new RTCSessionDescription(message)
			)
		);
		yield take('PEER_ACTION_DONE');
		const stream = yield call(getUserMediaStream, constraints);
		yield call(addTracks, conn_id, stream);
		console.log('GOT_MESSAGE', 'setting remote desc');
		for (i = 0; i < users.length; i++) {
			const user = users[i];
			const existingConnection = select(CallSelectors.connectionById, user);
			if (existingConnection) {
				yield put(Actions.editConnection(user.id, { call_id, signature }));
				return;
			} 
			yield put(Actions.addConnection(user.id, constraints, { call_id, signature }));
		}
	} else if (message.type === 'answer') {
		console.log('GOT_MESSAGE', 'answer: setting remote desc');
		yield put(
			Actions.peerAction(
				conn_id,
				'setRemoteDescription',
				new RTCSessionDescription(message)
			)
		);
		yield put(Actions.setCallActive(from.id, true));
		console.log('ADDED TRACK');
		console.log('set remote desc');
		// GETUSERMEDIA AFTER
		const stream = yield call(getUserMediaStream, constraints);
		
	} else if (message.type == 'candidate') {
		console.log('GOT_MESSAGE', 'candidate');
		const altCandid = new RTCIceCandidate({
			...message.candidate
		});
		yield put(Actions.peerAction(conn_id, 'addIceCandidate', altCandid));
	} else if (message.type == END_CONNECTION) {
		yield put(Actions.endCall(conn_id, { emit: false }));
	}
}

function* answerCallSaga({ payload: answered, id: call_id, users, from }) {
	
	if (!answered) {
		// CHANGE THIS
		return; // reject call action
	}
	yield call(sendOffersForCall, { call_id });
	const recipients = users; //yield select(CallSelectors.connectionsByCallId, { call_id });
	for (let i = 0; i < recipients.length; i++) {
		const recipient = recipients[i];
		const { incoming, offer_sent } = recipient;
		// if () {
		// 	yield 
		// }
		if (incoming) {
			yield spawn(answerCallForUser, recipients[i] );
		}
	}
	
}
function* answerCallForUser({ id, constraints }) {
	const conn_id = id;
	yield put(Actions.peerAction(conn_id, 'createAnswer'));
	const { payload: answer } = yield take('PEER_ACTION_DONE');
	console.log('GOT_MESSAGE', 'setting local desc');
	yield put(Actions.peerAction(conn_id, 'setLocalDescription', answer));
	console.log('GOT_MESSAGE', 'sending answer');
	socket.emit('message', answer, { constraints, users: [{ id: conn_id }]});
}
function* sendCandidateSaga(action) {
	console.log('sending candidate');
	const { payload } = action;
	const candidateToSend = { type: 'candidate', candidate: payload };
	console.log(candidateToSend);
	const activeConnections = yield select(CallSelectors.activeConnectionsList);
	const users = activeConnections.map(({ id }) => {
		return { id: id };
	});
	socket.emit('message', candidateToSend, { users });
}

function* endCallSaga({ id, emit }) {
	let user_ids = [];
	const activeConnections = yield select(CallSelectors.activeConnections);
	if (id && Array.isArray(id)) {
		user_ids = id;
	} else if (id) {
		if (!activeConnections[id]) return;
		user_ids.push(id);
	} else {
		user_ids = Object.keys(activeConnections).map(conn_id => conn_id);
	}
	for (i = 0; i < user_ids.length; i++) {
		yield put(Actions.endConnection(user_ids[i]));
	}
	if (emit) {
		socket.emit(
			'message',
			{ type: END_CONNECTION },
			{
				users: user_ids.map(user_id => ({
					id: user_id
				}))
			}
		);
	}

	// if (id) {}
	//yield put(Actions.peerAction(id, 'close'));
}
function* endUserConnectionSaga({ id }) {
	yield put(Actions.peerAction(id, 'close'));
}
function* rootSaga() {
	yield all([
		startSocketSaga(),
		takeLatest(SEND_CANDIDATE, sendCandidateSaga),
		takeLatest(SEND_OFFER, sendOfferSaga),
		takeEvery(GOT_MESSAGE, gotMessageSaga),
		takeEvery(START_CALL, startCallSaga),
		takeLatest(ANSWER_INCOMING, answerCallSaga),
		takeLatest(END_CALL, endCallSaga),
		takeLatest(END_CONNECTION, endUserConnectionSaga)
	]);
}

export default rootSaga;
