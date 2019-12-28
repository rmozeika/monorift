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
	GOT_MESSAGE
} = Actions;

import io from 'socket.io-client';

const nsp = 'call';
const socketServerURL = `https://monorift.com/${nsp}`;
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
			debugger;
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
		// const msgEvery = yield takeEvery(socketChannel, gotMessageSaga, )
		try {
			yield put({ type: GOT_MESSAGE, message, peerConstraints });
			//console.log(payload);
			// if (payload.user !== false) {
			//     yield put({ type: AUTH.LOGIN.SUCCESS,  payload });
			// } else {
			//     yield put({ type: AUTH.LOGIN.REQUEST }, payload);
			// }
		} catch (e) {
			//yield put({ type: AUTH.LOGIN.FAILURE,  payload });
		}
	}
}
function* sendCandidateSaga(action) {
	const { payload } = action;
	socket.emit('message', { type: 'candidate', candidate: payload });
}
function* createPeerConnSaga({ config = {} }) {
	const conn = new RTCPeerConnection(config);
	conn.onnegotiationneeded = async () => {
		try {
			await conn.setLocalDescription(await conn.createOffer());
			// send the offer to the other peer
			//signaling.send({desc: conn.localDescription});
			socket.emit('message', conn.localDescription);
		} catch (err) {
			console.error(err);
		}
	};
	yield put(Actions.setPeerConn(conn));
	console.log(conn);
}
function* sendOfferSaga({ offer, constraints }) {
	// socket.emit('message', { type: offer, offer });
	socket.emit('message', offer, constraints);
}
function* gotOfferSaga({ offer }) {}
const selectConn = state => {
	return state.call.peerConn.conn;
};
const selectConstraints = state => {
	return state.call.constraints.mediaStream;
};

function* gotMessageSaga({ message, peerConstraints }) {
	//while (true) {
	const conn = yield select(selectConn);
	mediaStreamConstraints = yield select(selectConstraints);
	//const message = message.offer;
	console.log(message);
	if (message.type == 'offer') {
		if (!isInitiator && !isStarted) {
			maybeStart();
		}
		yield conn.setRemoteDescription(message);
		const stream = yield navigator.mediaDevices.getUserMedia(peerConstraints);
		stream.getTracks().forEach(track => {
			conn.addTrack(track, stream);
		});
		console.log('ADDED TRACK');
		const answer = yield conn.createAnswer();
		yield conn.setLocalDescription(answer);
		socket.emit('message', conn.localDescription);
		console.log('set local desc');
		//signaling.send({message: conn.localDescription});
	} else if (message.type === 'answer') {
		yield conn.setRemoteDescription(message);
		console.log('set remote desc');
	} else if (message.type == 'candidate') {
		//socket.emit('message', )
		conn.addIceCandidate(message.candidate);
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
