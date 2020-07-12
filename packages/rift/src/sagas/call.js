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
	cancelled
} from 'redux-saga/effects';
import { eventChannel, runSaga } from 'redux-saga';
import { originLink } from '../core/utils';
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch';

import * as Actions from '@actions';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
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
		const oldOnMsg = (msg, secondArg) => {
			if (msg.type == 'candidate') {
				onCandidateHandler(msg.candidate);
			}
			if (msg.type == 'offer') {
				put({ type: GOT_MESSAGE, msg }, constraints);
			}
		};

		return () => {
			//socket.off('login', handler);
		};
	});
function* socketListener() {
	const socket = yield call(connect);
	const socketChannel = yield call(createSocketChannel, socket);
	console.log('created call socket channel');
	while (true) {
		const { message, constraints, users, from } = yield take(socketChannel);
		try {
			yield put({ type: GOT_MESSAGE, message, constraints, users, from });
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
		yield put(sendOffer({ id, user, constraints }));
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
		users = Object.keys(checked).map(id => checked[id]);
	}
	return users;
}
function* sendOfferSaga({ constraints, offerOptions, id = false, user }) {
	console.log('Sending offer');
	let users = yield call(getUsers, user);
	for (let i = 0; i < users.length; i++) {
		const conn_id = users[i].id;
		yield put(Actions.addConnection(conn_id, constraints));
		yield put(Actions.peerAction(conn_id, 'createOffer', offerOptions));
		const { payload: offer } = yield take('PEER_ACTION_DONE');
		yield put(Actions.peerAction(conn_id, 'setLocalDescription', offer));
		yield take('PEER_ACTION_DONE');
		socket.emit('message', offer, { constraints, users: [users[i]] });
	}
}
function* getUserMediaStream(constraints) {
	console.log('START', 'getting usermedia');
	const stream = yield putResolve(Actions.getUserMedia(constraints));
	return stream;
}

function* gotMessageSaga({ message, constraints, from }) {
	console.log('GOT_MESSAGE', message);
	const conn_id = from.id;
	if (message.type == 'offer') {
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
		yield put(Actions.setIncomingConnection(conn_id, constraints));
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
		// let users = yield call(getUsers, user);
		// for (let i = 0; i < users.length; i++) {
		// 	const conn_id = users[i].id;

		//yield call(addTracks, conn_id, stream);
		// }
	} else if (message.type == 'candidate') {
		console.log('GOT_MESSAGE', 'candidate');
		const altCandid = new RTCIceCandidate({
			...message.candidate
		});
		yield put(Actions.peerAction(conn_id, 'addIceCandidate', altCandid));
	}
}

function* answerCallSaga({ payload: answered, id, from }) {
	if (!answered) {
		// CHANGE THIS
		return; // reject call action
	}
	const conn_id = id || from.id;
	yield put(Actions.peerAction(conn_id, 'createAnswer'));

	const { payload: answer } = yield take('PEER_ACTION_DONE');
	console.log('GOT_MESSAGE', 'setting local desc');
	yield put(Actions.peerAction(conn_id, 'setLocalDescription', answer));
	console.log('GOT_MESSAGE', 'sending answer');
	socket.emit('message', answer, { users: [from] });
}

function* sendCandidateSaga(action) {
	console.log('sending candidate');
	const { payload } = action;
	const candidateToSend = { type: 'candidate', candidate: payload };
	console.log(candidateToSend);
	const activeConnections = yield select(CallSelectors.activeConnections);
	const users = activeConnections.map(({ id }) => {
		return { id: id };
	});
	socket.emit('message', candidateToSend, { users });
}

function* endCallSaga({ id }) {
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
		takeLatest(END_CALL, endCallSaga)
	]);
}

export default rootSaga;
