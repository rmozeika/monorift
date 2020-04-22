/* global fetch */

import {
	all,
	call,
	delay,
	put,
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
	setRemote,
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
	// const { users } = state.users.online;
	// const selectedUsers = users.filter(({ name, checked }) => checked);
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
	// yield put(
	// 	// CHANGE THIS TO NEW URL
	// 	Actions.createPeerConn({
	// 		iceServers: [
	// 			{
	// 				urls: 'stun:stun.l.google.com:19302'
	// 			},
	// 			{
	// 				urls: 'turn:monorift:78?transport=udp',
	// 				credential: '0x054c7df422cd6b99b6f6cae2c0bdcc14',
	// 				username: 'rtcpeer'
	// 			}
	// 		]
	// 	})
	// );
	const socketChannel = yield call(createSocketChannel, socket);
	while (true) {
		const { message, constraints, users, from } = yield take(socketChannel);
		try {
			yield put({ type: GOT_MESSAGE, message, constraints, users, from });
		} catch (e) {
			console.log('Call Saga Error', e);
			//yield put({ type: AUTH.LOGIN.FAILURE,  payload });
		}
	}
}
function* sendCandidateSaga(action) {
	console.log('sending candidate');
	const { payload } = action;
	const candidateToSend = { type: 'candidate', candidate: payload };
	console.log(candidateToSend);
	socket.emit('message', candidateToSend);
}
function* createPeerConnSaga(action) {
	if (true == true) return;
	const { config } = action;
	try {
		const conn = new RTCPeerConnection(config);

		yield put(Actions.setPeerConn(conn));

		window.conn = conn;
		const tickChannel = eventChannel(emit => {
			conn.onnegotiationneeded = async e => {
				console.log('On negition needed called');
				emit('offer needed');
				console.log();
			};
			return () => {};
		});
		for (let i = 0; i < 5; i++) {
			yield take(tickChannel);
			// yield put(sendOffer({}));
		}
		console.log(conn);
	} catch (error) {
		console.log(error);
	}
}
function* peerCaller(offerOpts) {
	let config = {};
	const conn = new RTCPeerConnection(config);
	console.log('createdPeerconn');
	let result;
	while (true) {
		const data = yield conn.createOffer(offerOpts);
		return new Promise((resolve, reject) => {
			resolve(data);
		});
	}
}
function* sendOfferSaga({ altConstraints, altOfferOptions, id = false, user }) {
	console.log('Sending offer');

	const { mediaStream, offerOptions } = yield select(selectConstraints);
	const constraints = { ...mediaStream, ...altConstraints };
	const offerOpts = { ...offerOptions, ...altOfferOptions };
	yield put(Actions.peerAction('createOffer', offerOpts));
	const { payload: offer } = yield take('PEER_ACTION_DONE');
	yield put(Actions.peerAction('setLocalDescription', offer));
	yield take('PEER_ACTION_DONE');

	yield put(Actions.setPeerInitiator(true));
	let users;
	if (id) {
		users = [user];
	} else {
		const checked = yield select(selectCheckedUsers);
		users = Object.keys(checked).map(id => checked[id]);
		//  Object.values(checked).map(({ oauth_id }) => {
		// 	return oauth_id;
		// });
	}
	for (let i = 0; i < users.length; i++) {
		yield put(Actions.addConnection(users[i].oauth_id));
	}

	const from = yield select(selectMe);

	socket.emit('message', offer, { constraints, users });
}
function* gotOfferSaga({ offer }) {}

const start = async (conn, peerConstraints) => {
	put(Actions.setPeerStarted(true));
	console.log('START', 'getting usermedia');
	console.log('getting user media');

	const stream = await navigator.mediaDevices.getUserMedia(peerConstraints);
	return stream; //.getTracks();
	// stream.getTracks().forEach(track => {
	// 	console.log('adding track', 'from message start func');
	// 	conn.addTrack(track, stream);
	// });
	console.log('finished adding tracks');
	// return;
};
function addCandidate(candidate) {}
function* gotMessageSaga({ message, constraints, from }) {
	const peerStore = yield select(selectPeerStore);
	const { conn, isStarted, isInitiator } = peerStore;
	console.log('GOT_MESSAGE', message);
	if (message.type == 'offer') {
		if (constraints) {
			yield put(setConstraints({ mediaStream: constraints }));
		}
		// const resolved = yield put({ type: 'PEER_ACTION', payload: { method: setRemoteDescription, args: [new RTCSessionDescription(message)]}});
		yield put(
			Actions.peerAction(
				'setRemoteDescription',
				new RTCSessionDescription(message)
			)
		);
		const result = yield take('PEER_ACTION_DONE');
		// yield conn.setRemoteDescription(new RTCSessionDescription(message));

		if (!isInitiator && !isStarted) {
			const stream = yield call(start, conn, constraints);
			const tracks = stream.getTracks();
			// const tracks = stream.getTracks();
			for (i = 0; i < tracks.length; i++) {
				// yield put({ type: 'PEER_ACTION', payload: { method: 'addTrack', args: [ track[i], stream ] }})
				yield put(Actions.peerAction('addTrack', tracks[i], stream));
			}
		} else {
			console.log('getting user media');
			const stream = yield navigator.mediaDevices.getUserMedia(constraints);
			const tracks = stream.getTracks();
			for (i = 0; i < tracks.length; i++) {
				// yield put({ type: 'PEER_ACTION', payload: { method: 'addTrack', args: [ track[i], stream ] }})
				yield put(Actions.peerAction('addTrack', tracks[i], stream));
			}
			// stream.getTracks().forEach(track => {
			// 	console.log('adding track', 'from message start func');
			// 	// yield put({ type: 'PEER_ACTION', payload: { method: 'addTrack', args: [ track, stream ] }})
			// 	conn.addTrack(track, stream);
			// });
		}
		console.log('GOT_MESSAGE', 'setting remote desc');
		yield put(setRemote(true));
		console.log('put setting remote');
		console.log('GOT_MESSAGE', 'creating answer');
		yield put(setIncomingCall(from));

		// ADD REMOVE LATER
		// console.log('GOT_MESSAGE', 'creating answer');
		// const answer = yield conn.createAnswer().catch(e => {
		// 	console.log(e);
		// 	debugger; //error
		// });
		// console.log('GOT_MESSAGE', 'setting local desc');

		// yield conn.setLocalDescription(answer);
		// // socket.emit('message', conn.localDescription);
		// console.log('GOT_MESSAGE', 'sending answer');
		// const desc = conn.localDescription;
		// const sendBackTo = from;
		// socket.emit('message', desc, { users: [from] });
		// ^ ADD REMOVE LATER
	} else if (message.type === 'answer') {
		console.log('GOT_MESSAGE', 'answer: setting remote desc');
		yield put(
			Actions.peerAction(
				'setRemoteDescription',
				new RTCSessionDescription(message)
			)
		);

		yield put(setRemote(true));
		const { mediaStream } = yield select(selectConstraints);
		yield put(Actions.setCallActive(from.oauth_id, true));
		console.log('ADDED TRACK');
		console.log('set remote desc');
	} else if (message.type == 'candidate') {
		// before needed to wait for set remote, however the order seems to be fixed
		// no need for take
		// const action = yield take(SET_REMOTE);
		console.log('GOT_MESSAGE', 'candidate');
		const altCandid = new RTCIceCandidate({
			...message.candidate
		});
		yield put(Actions.peerAction('addIceCandidate', altCandid));
	}
}
function* incomingCallSaga(incomingCall) {
	// const incomingCall =
	// const answer = yield conn.createAnswer().catch(e => {
	// 	console.log(e);
	// 	debugger; //error
	// });
	// console.log('GOT_MESSAGE', 'setting local desc');
	// yield = username.setLocalDescription(answer);
	// // socket.emit('message', conn.localDescription);
	// console.log('GOT_MESSAGE', 'sending answer');
	// const desc = conn.localDescription;
	// const sendBackTo = from;
	// socket.emit('message', desc, { users: [from] });
}
const getUserMedia = async constraints => {
	stream = await navigator.mediaDevices.getUserMedia(constraints);
	window.stream = stream; // make variable available to browser console
	return stream;
	// this.gotMedia(stream);
};
function* startCallSaga({ payload, mediaStream }) {
	const { type, id, user } = payload;
	yield put(setPeerInitiator(true));
	const constraints = { audio: true, video: type == 'video' };
	yield put(setConstraints({ mediaStream: constraints }));
	// get set media constraints here CHANGE THIS
	// let stream = null;
	// const { peerStore } = this.props;
	// const { conn } = peerStore;
	try {
		let stream;
		if (mediaStream) {
			stream = mediaStream;
		} else {
			stream = yield getUserMedia(constraints);
		}
		// const stream = yield navigator.mediaDevices.getUserMedia(constraints);
		const tracks = stream.getTracks();
		for (i = 0; i < tracks.length; i++) {
			// yield put({ type: 'PEER_ACTION', payload: { method: 'addTrack', args: [ track[i], stream ] }})
			yield put(Actions.peerAction('addTrack', tracks[i], stream));
		}
		yield put(sendOffer({ id, user }));
		// stream = await navigator.mediaDevices.getUserMedia(constraints);
		// window.stream = stream; // make variable available to browser console
		// this.gotMedia(stream);
	} catch (err) {
		console.log(err);
		/* handle the error */
	}
}
function* answerCallSaga({ payload: answered }) {
	if (!answered) {
		// CHANGE THIS
		return; // reject call action
	}
	const peerStore = yield select(selectPeerStore);
	const { conn, isStarted, isInitiator, incomingCall } = peerStore;
	const { from } = incomingCall;
	yield put(Actions.peerAction('createAnswer'));
	// yield conn.createAnswer().catch(e => {
	// 	console.log(e);
	// 	debugger; //error
	// });
	const { payload: answer } = yield take('PEER_ACTION_DONE');
	console.log('GOT_MESSAGE', 'setting local desc');
	yield put(Actions.peerAction('setLocalDescription', answer));
	// yield conn.setLocalDescription(answer);
	console.log('GOT_MESSAGE', 'sending answer');
	// const desc = conn.localDescription;
	const sendBackTo = from;
	socket.emit('message', answer, { users: [from] });
	// put(Actions.)

	// const stream = yield navigator.mediaDevices.getUserMedia(constraints);

	// stream.getTracks().forEach(track => {
	// 	console.log('adding track', 'from message start func');
	// 	conn.addTrack(track, stream);
	// });
}

function* rootSaga() {
	yield all([
		initCallSaga(),
		takeLatest(SEND_CANDIDATE, sendCandidateSaga),
		// unused;
		takeLatest(CREATE_PEER_CONN, createPeerConnSaga),
		takeLatest(SEND_OFFER, sendOfferSaga),
		takeEvery(GOT_MESSAGE, gotMessageSaga),
		takeEvery(START_CALL, startCallSaga),

		// takeLatest(CALL_INCOMING, incomingCallSaga)
		takeLatest(ANSWER_INCOMING, answerCallSaga)
	]);
}

export default rootSaga;
