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
	fork
} from 'redux-saga/effects';
import { eventChannel, runSaga } from 'redux-saga';
import { originLink } from '../core/utils';
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch';

import * as Actions from '@actions';
import * as CallSelectors from '@selectors/call';
let mediaStreamConstraints = {
	audio: true,
	video: false
};
const {
	AUTH,
	ADD_CANDIDATE,
	CREATE_PEER_CONN,
	SEND_CANDIDATE,
	SEND_OFFER,
	GOT_MESSAGE,
	SET_REMOTE,
	ANSWER_INCOMING,
	START_CALL,
	END_CALL,
	setConstraints,
	sendOffer,
	setIncomingCall,
	setPeerInitiator
} = Actions;

import io from 'socket.io-client';
const onError = e => {
	console.log(e);
	debugger; //error
};
const selectPeerStore = state => {
	return state.call.peerStore;
};
const selectIncomingCall = state => {
	return state.call.peerStore.incomingCall;
};
const selectConstraints = state => {
	const { mediaStream, offerOptions } = state.call.constraints;
	return { mediaStream, offerOptions };
};
const selectMe = state => {
	const { username } = state.auth.user;
	return username;
};
const selectCheckedUsers = state => {
	const { queued } = state.users;

	return queued;
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

function* initCallSaga() {
	const socket = yield call(connect);
	const socketChannel = yield call(createSocketChannel, socket);
	while (true) {
		const { message, constraints, users, from } = yield take(socketChannel);
		try {
			yield put({ type: GOT_MESSAGE, message, constraints, users, from });
		} catch (e) {
			console.log('Call Saga Error', e);
		}
	}
}
function* addTracks(conn_id, stream) {
	const tracks = stream.getTracks();
	for (i = 0; i < tracks.length; i++) {
		yield put(Actions.peerAction(conn_id, 'addTrack', tracks[i], stream));
	}
}
function* startCallSaga({ payload, mediaStream }) {
	const { type, id, user } = payload;
	yield put(setPeerInitiator(true));
	const constraints = { audio: true, video: type == 'video' };
	yield put(setConstraints({ mediaStream: constraints }));

	try {
		let stream;
		if (mediaStream) {
			stream = mediaStream;
		} else {
			stream = yield putResolve(Actions.getUserMedia(constraints));
			// stream = yield getUserMedia(constraints);
		}

		let users = yield call(getUsers, user);
		for (let i = 0; i < users.length; i++) {
			const conn_id = users[i].oauth_id;
			yield call(addTracks, conn_id, stream);
		}
		yield put(sendOffer({ id, user }));
	} catch (err) {
		console.log(err);
		debugger; //error
	}
}

function* getUsers(user) {
	let users;
	const userId = user?.oauth_id || user?.id;
	if (userId) {
		users = [user];
	} else {
		const checked = yield select(selectCheckedUsers);
		users = Object.keys(checked).map(id => checked[id]);
	}
	return users;
}
function* sendOfferSaga({ altConstraints, altOfferOptions, id = false, user }) {
	console.log('Sending offer');

	const { mediaStream, offerOptions } = yield select(selectConstraints);
	const constraints = { ...mediaStream, ...altConstraints };
	const offerOpts = { ...offerOptions, ...altOfferOptions };
	yield put(Actions.setPeerInitiator(true));
	let users = yield call(getUsers, user);
	for (let i = 0; i < users.length; i++) {
		yield put(Actions.addConnection(users[i].oauth_id));
		const conn_id = users[i].oauth_id;
		yield put(Actions.peerAction(conn_id, 'createOffer', offerOpts));
		const { payload: offer } = yield take('PEER_ACTION_DONE');
		yield put(Actions.peerAction(conn_id, 'setLocalDescription', offer));
		yield take('PEER_ACTION_DONE');
		socket.emit('message', offer, { constraints, users: [users[i]] });
	}
}
function* start(constraints) {
	yield put(Actions.setPeerStarted(true));
	console.log('START', 'getting usermedia');
	// const stream = await navigator.mediaDevices.getUserMedia(peerConstraints);
	const stream = yield putResolve(Actions.getUserMedia(constraints));
	debugger; //remove
	return stream;
}
const starts = async constraints => {
	put(Actions.setPeerStarted(true));
	console.log('START', 'getting usermedia');
	console.log('getting user media');

	// const stream = await navigator.mediaDevices.getUserMedia(peerConstraints);
	const stream = await putResolve(Actions.getUserMedia(constraints));
	debugger; //remove
	return stream;
};
function* gotMessageSaga({ message, constraints, from }) {
	const peerStore = yield select(selectPeerStore);
	const { isStarted, isInitiator } = peerStore;
	console.log('GOT_MESSAGE', message);
	const conn_id = from.oauth_id;
	// debugger; //remove
	if (message.type == 'offer') {
		if (constraints) {
			yield put(setConstraints({ mediaStream: constraints }));
		}
		yield put(
			Actions.peerAction(
				conn_id,
				'setRemoteDescription',
				new RTCSessionDescription(message)
			)
		);
		const result = yield take('PEER_ACTION_DONE');

		if (!isInitiator && !isStarted) {
			const stream = yield call(start, constraints);
			yield call(addTracks, conn_id, stream);
		} else {
			// Maybe combine this with start conn above
			console.log('getting user media');
			// const stream = yield navigator.mediaDevices.getUserMedia(constraints);
			const stream = yield putResolve(Actions.getUserMedia(constraints));
			yield call(addTracks, conn_id, stream);
		}
		console.log('GOT_MESSAGE', 'setting remote desc');
		// CHANGE TO CONNECTION
		yield put(setIncomingCall(from));
	} else if (message.type === 'answer') {
		console.log('GOT_MESSAGE', 'answer: setting remote desc');
		yield put(
			Actions.peerAction(
				conn_id,
				'setRemoteDescription',
				new RTCSessionDescription(message)
			)
		);
		const { mediaStream } = yield select(selectConstraints);
		yield put(Actions.setCallActive(from.oauth_id, true));
		console.log('ADDED TRACK');
		console.log('set remote desc');
	} else if (message.type == 'candidate') {
		console.log('GOT_MESSAGE', 'candidate');
		const altCandid = new RTCIceCandidate({
			...message.candidate
		});
		yield put(Actions.peerAction(conn_id, 'addIceCandidate', altCandid));
	}
}

const getUserMedia = async constraints => {
	stream = await navigator.mediaDevices.getUserMedia(constraints);
	window.stream = stream; // make variable available to browser console
	return stream;
};

function* answerCallSaga({ payload: answered }) {
	if (!answered) {
		// CHANGE THIS
		return; // reject call action
	}
	const peerStore = yield select(selectPeerStore);
	// CHANGE THIS TO USE CONNECTIONS
	const { incomingCall } = peerStore;
	const { from } = incomingCall;
	const conn_id = from.oauth_id;
	yield put(Actions.peerAction(conn_id, 'createAnswer'));

	const { payload: answer } = yield take('PEER_ACTION_DONE');
	console.log('GOT_MESSAGE', 'setting local desc');
	yield put(Actions.peerAction(conn_id, 'setLocalDescription', answer));
	console.log('GOT_MESSAGE', 'sending answer');
	const sendBackTo = from;
	socket.emit('message', answer, { users: [from] });
}

function* sendCandidateSaga(action) {
	console.log('sending candidate');
	const { payload } = action;
	const candidateToSend = { type: 'candidate', candidate: payload };
	console.log(candidateToSend);
	const activeConnections = yield select(CallSelectors.activeConnections);
	const users = activeConnections.map(({ id }) => {
		return { oauth_id: id };
	});
	// debugger; //remove
	socket.emit('message', candidateToSend, { users });
}

function* endCallSaga({ id }) {
	yield put(Actions.peerAction(id, 'close'));
}
function* rootSaga() {
	yield all([
		initCallSaga(),
		takeLatest(SEND_CANDIDATE, sendCandidateSaga),
		takeLatest(SEND_OFFER, sendOfferSaga),
		takeEvery(GOT_MESSAGE, gotMessageSaga),
		takeEvery(START_CALL, startCallSaga),
		takeLatest(ANSWER_INCOMING, answerCallSaga),
		takeLatest(END_CALL, endCallSaga)
	]);
}

export default rootSaga;
