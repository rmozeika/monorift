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
import { eventChannel } from 'redux-saga';
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
	setRemote
} = Actions;

import io from 'socket.io-client';
const onError = e => {
	console.log(e);
	debugger;
};
const selectPeerStore = state => {
	return state.call.peerStore;
};
const selectConstraints = state => {
	return state.call.constraints.mediaStream;
};
const nsp = 'call';
// const socketServerURL = `https://monorift.com/${nsp}`;
const socketServerURL = `http://localhost:8080/${nsp}`;

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
			emit({ message: data, peerConstraints: secondArg });
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
				put({ type: GOT_MESSAGE, msg }, peerConstraints);
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
		const { message, peerConstraints } = yield take(socketChannel);
		try {
			yield put({ type: GOT_MESSAGE, message, peerConstraints });
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
function* createPeerConnSaga({ config = {} }) {
	const conn = new RTCPeerConnection(config);
	window.conn = conn;
	conn.onnegotiationneeded = async e => {
		console.log('On negition needed called');
		// // if (true) return;
		// try {

		// 	debugger;
		// 	const desc = await conn.createOffer();
		// 	conn.setLocalDescription(desc).catch(e => {
		// 		console.log(e);
		// 	});
		// 	socket.emit('message', desc, { audio: true, video: true });
		// 	await conn.setLocalDescription(await conn.createOffer());
		// 	// send the offer to the other peer
		// 	//signaling.send({desc: conn.localDescription});
		// 	socket.emit('message', conn.localDescription);
		// } catch (err) {
		// 	console.error(err);
		// }
	};
	yield put(Actions.setPeerConn(conn));
	console.log(conn);
}
function* sendOfferSaga({ constraints }) {
	// socket.emit('message', { type: offer, offer });
	// if (true) {
	// 	return;
	// }
	console.log('Sending offer');
	const offerOptions = {
		// offerToReceiveVideo: 1,
	};
	const { conn } = yield select(selectPeerStore);
	const offer = yield conn
		.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true })
		.catch(e => {
			debugger;
		});
	conn.setLocalDescription(offer);
	yield put(Actions.setPeerInitiator(true));
	socket.emit('message', offer, constraints);
}
function* gotOfferSaga({ offer }) {}

const start = async (conn, peerConstraints) => {
	put(Actions.setPeerStarted(true));
	console.log('START', 'getting usermedia');
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
function* gotMessageSaga({ message, peerConstraints }) {
	//while (true) {
	const peerStore = yield select(selectPeerStore);
	const { conn, isStarted, isInitiator } = peerStore;
	mediaStreamConstraints = yield select(selectConstraints);
	//const message = message.offer;
	console.log('GOT_MESSAGE', message);
	if (message.type == 'offer') {
		yield conn.setRemoteDescription(new RTCSessionDescription(message));

		if (!isInitiator && !isStarted) {
			const starter = yield call(start, conn, peerConstraints);
			// return;
			//put(Actions.setPeerStarted(true));
		} else {
			const stream = yield navigator.mediaDevices.getUserMedia(peerConstraints);
			stream.getTracks().forEach(track => {
				console.log('adding track', 'from message start func');
				conn.addTrack(track, stream);
			});
		}
		console.log('GOT_MESSAGE', 'setting remote desc');
		// yield conn.setRemoteDescription(new RTCSessionDescription(message));
		debugger;
		yield put(setRemote(true));
		console.log('put setting remote');
		// const stream = yield navigator.mediaDevices.getUserMedia(peerConstraints);
		// stream.getTracks().forEach(track => {
		// 	conn.addTrack(track, stream);
		// });
		// console.log('ADDED TRACK');
		console.log('GOT_MESSAGE', 'creating answer');
		const answer = yield conn.createAnswer().catch(e => {
			console.log(e);
			debugger;
		});
		console.log('GOT_MESSAGE', 'setting local desc');

		yield conn.setLocalDescription(answer);
		// socket.emit('message', conn.localDescription);
		console.log('GOT_MESSAGE', 'sending answer');
		const desc = conn.localDescription;
		socket.emit('message', desc);
		// console.log('set local desc');
		//signaling.send({message: conn.localDescription});
	} else if (message.type === 'answer') {
		console.log('GOT_MESSAGE', 'answer: setting remote desc');
		yield conn
			.setRemoteDescription(new RTCSessionDescription(message))
			.catch(e => {
				debugger;
				console.log(e);
			});
		yield put(setRemote(true));
		const stream = yield navigator.mediaDevices.getUserMedia({
			audio: true,
			video: true
		});
		stream.getTracks().forEach(track => {
			conn.addTrack(track, stream);
		});
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
			debugger;
		});
		// conn.addIceCandidate({candidate: ''});
		// }
	}
	//}
}
function* rootSaga() {
	yield all([
		initCallSaga(),
		takeLatest(SEND_CANDIDATE, sendCandidateSaga),
		takeLatest(CREATE_PEER_CONN, createPeerConnSaga),
		takeLatest(SEND_OFFER, sendOfferSaga),
		takeEvery(GOT_MESSAGE, gotMessageSaga)
	]);
}

export default rootSaga;
