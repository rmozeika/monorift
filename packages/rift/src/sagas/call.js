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
	select
} from 'redux-saga/effects';
import { eventChannel, runSaga } from 'redux-saga';
import { originLink } from '../core/utils';
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch';

import * as Actions from '../actions';

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
	setRemote,
	setConstraints,
	sendOffer,
	setIncomingCall
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
	const { users } = state.users.online;
	const selectedUsers = users.filter(({ name, checked }) => checked);
	return selectedUsers;
};
const nsp = 'call';

// const socketServerURL = `https://monorift.com/${nsp}`;
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
	//socket.send('hi');
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
	const { config } = action;
	try {
		const conn = new RTCPeerConnection(config);
		yield put(Actions.setPeerConn(conn));

		window.conn = conn;
		// const putOffer =
		const tickChannel = eventChannel(emit => {
			conn.onnegotiationneeded = async e => {
				console.log('On negition needed called');
				emit('offer needed');
				console.log();
			};
			// const handle = setInterval(() => {
			//   emit("tick");
			// }, 100);
			return () => {};
		});
		for (let i = 0; i < 5; i++) {
			yield take(tickChannel);
			yield put(sendOffer({}));
		}
		console.log(conn);
	} catch (error) {
		console.log(error);
	}
}
function* sendOfferSaga({ altConstraints, altOfferOptions }) {
	console.log('Sending offer');

	const { mediaStream, offerOptions } = yield select(selectConstraints);
	const constraints = { ...mediaStream, ...altConstraints };
	const offerOpts = { ...offerOptions, ...altOfferOptions };

	const { conn } = yield select(selectPeerStore);
	const offer = yield conn.createOffer(offerOpts).catch(e => {
		console.log(e);
		debugger; //error
	});
	conn.setLocalDescription(offer);
	yield put(Actions.setPeerInitiator(true));
	const users = yield select(selectCheckedUsers);
	const from = yield select(selectMe);

	socket.emit('message', offer, { constraints, users });
}
function* gotOfferSaga({ offer }) {}

const start = async (conn, peerConstraints) => {
	put(Actions.setPeerStarted(true));
	console.log('START', 'getting usermedia');
	console.log('getting user media');

	const stream = await navigator.mediaDevices.getUserMedia(peerConstraints);
	stream.getTracks().forEach(track => {
		console.log('adding track', 'from message start func');
		conn.addTrack(track, stream);
	});
	// conn.addStream(stream);
	console.log('finished adding tracks');
	return;
};
function addCandidate(candidate) {}
function* gotMessageSaga({ message, constraints, from }) {
	//while (true) {
	const peerStore = yield select(selectPeerStore);
	const { conn, isStarted, isInitiator } = peerStore;
	// mediaStreamConstraints = yield select(selectConstraints);
	//const message = message.offer;
	console.log('GOT_MESSAGE', message);
	if (message.type == 'offer') {
		if (constraints) {
			yield put(setConstraints({ mediaStream: constraints }));
		}

		yield conn.setRemoteDescription(new RTCSessionDescription(message));

		if (!isInitiator && !isStarted) {
			const starter = yield call(start, conn, constraints);
			// return;
			//put(Actions.setPeerStarted(true));
		} else {
			console.log('getting user media');
			const stream = yield navigator.mediaDevices.getUserMedia(constraints);
			stream.getTracks().forEach(track => {
				console.log('adding track', 'from message start func');
				conn.addTrack(track, stream);
			});
		}
		console.log('GOT_MESSAGE', 'setting remote desc');
		// yield conn.setRemoteDescription(new RTCSessionDescription(message));
		yield put(setRemote(true));
		console.log('put setting remote');
		// const stream = yield navigator.mediaDevices.getUserMedia(constraints);
		// stream.getTracks().forEach(track => {
		// 	conn.addTrack(track, stream);
		// });
		// console.log('ADDED TRACK');
		console.log('GOT_MESSAGE', 'creating answer');
		yield put(setIncomingCall(from));
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
		// console.log('set local desc');
		//signaling.send({message: conn.localDescription});
	} else if (message.type === 'answer') {
		console.log('GOT_MESSAGE', 'answer: setting remote desc');
		yield conn
			.setRemoteDescription(new RTCSessionDescription(message))
			.catch(e => {
				console.log(e);
				debugger; //error
			});
		yield put(setRemote(true));
		// const stream = yield navigator.mediaDevices.getUserMedia({
		// 	audio: true,
		// 	video: true
		// });
		const { mediaStream } = yield select(selectConstraints);

		// HERE!!
		// const stream = yield navigator.mediaDevices.getUserMedia(mediaStream);
		// stream.getTracks().forEach(track => {
		// 	conn.addTrack(track, stream);
		// });
		console.log('ADDED TRACK');
		console.log('set remote desc');
	} else if (message.type == 'candidate') {
		// const { remoteSet } = yield select(selectPeerStore);
		// while (true) {
		const action = yield take(SET_REMOTE);
		//socket.emit('message', )
		console.log('GOT_MESSAGE', 'candidate');
		const altCandid = new RTCIceCandidate({
			// sdpMLineIndex: message.label,
			...message.candidate
		});
		// conn.addIceCandidate(message.candidate);
		conn.addIceCandidate(altCandid).catch(e => {
			console.log(e);
			debugger; //error
		});
		// conn.addIceCandidate({candidate: ''});
		// }
	}
	//}
}
function* incomingCallSaga(incomingCall) {
	// const incomingCall =
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
}
function* answerCallSaga({ payload: answered }) {
	if (!answered) {
		return; // reject call action
	}
	const peerStore = yield select(selectPeerStore);
	const { conn, isStarted, isInitiator, incomingCall } = peerStore;
	const { from } = incomingCall;
	const answer = yield conn.createAnswer().catch(e => {
		console.log(e);
		debugger; //error
	});
	console.log('GOT_MESSAGE', 'setting local desc');

	yield conn.setLocalDescription(answer);
	// socket.emit('message', conn.localDescription);
	console.log('GOT_MESSAGE', 'sending answer');
	const desc = conn.localDescription;
	const sendBackTo = from;
	socket.emit('message', desc, { users: [from] });
}

function* rootSaga() {
	yield all([
		initCallSaga(),
		takeLatest(SEND_CANDIDATE, sendCandidateSaga),
		takeLatest(CREATE_PEER_CONN, createPeerConnSaga),
		takeLatest(SEND_OFFER, sendOfferSaga),
		takeEvery(GOT_MESSAGE, gotMessageSaga),
		// takeLatest(CALL_INCOMING, incomingCallSaga)
		takeLatest(ANSWER_INCOMING, answerCallSaga)
	]);
}

export default rootSaga;
