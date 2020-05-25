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
	spawn
} from 'redux-saga/effects';

import * as Actions from '@actions';
import { eventChannel, runSaga } from 'redux-saga';
const config = {
	iceServers: [
		{
			urls: 'stun:stun.monorift.com:80'
		},
		{
			urls: 'turn:turn.monorift.com:443?transport=udp',
			credential: '0x054c7df422cd6b99b6f6cae2c0bdcc14',
			username: 'rtcpeer'
		}
	]
};

function* addIceListener(conn) {
	const chan = eventChannel(emit => {
		conn.addEventListener('icecandidate', e => {
			console.log('got candidate onicecandidate event');
			const peerConnection = event.target;
			const iceCandidate = event.candidate;

			if (iceCandidate && event.currentTarget.remoteDescription !== null) {
				const newIceCandidate = new RTCIceCandidate(iceCandidate);
				console.log('sending candidate');
				emit(newIceCandidate);
			}
		});
		return () => {};
	});

	while (true) {
		const candidate = yield take(chan);
		yield put(Actions.sendCandidate(candidate));
	}
}
function* iceConnectionStateChange(conn, id) {
	const chan = eventChannel(emit => {
		conn.addEventListener('iceconnectionstatechange', event => {
			console.log(`ice connection state change: ${conn.iceConnectionState}`);
			switch (conn.iceConnectionState) {
				case 'closed':
				case 'failed':
				case 'disconnected':
					emit(Actions.endCall(id));
					break;
			}
		});
		return () => {};
	});

	while (true) {
		const action = yield take(chan);
		console.log(action);
		yield put(action);
		// yield put(Actions.sendCandidate(candidate));
	}
}
function* addTrackListener(conn, id) {
	const chan = eventChannel(emit => {
		const onTrack = e => {
			// CHANGE THIS select from store;
			// const { mediaStreamConstraints } = this.props;
			// const mediaStreamConstraints = { audio: true, video: false };
			console.log('ONTRACK called', e);
			console.log('on track ID', e.track.id);
			if (e.streams?.[0]) {
				const stream = e.streams[0];
				emit(e.track);
				return;
			}

			if (mediaStreamConstraints.video && e.track.kind == 'video') {
				if (!videoRef?.current) {
					return;
				}
				if (e.streams?.[0]) {
					videoRef.current.srcObject = e.streams[0];
					videoRef.current.muted = true;
				} else {
					// CHANGE THIS!!!
					let inboundStream;
					if (!inboundStream) {
						inboundStream = new MediaStream();
						videoRef.current.srcObject = inboundStream;
					}
					inboundStream.addTrack(e.track);
				}
				// if (videoRef.current.srcObject !== null) {
				// 	return;
				// }
				// videoRef.current.srcObject = e.streams[0];
				// return;
				return;
			}
			// if (!audioRef?.current) {
			// 	return;
			// }
			if (e.streams?.[0]) {
				const stream = e.streams[0];
				emit(e.track);
				// audioRef.current.srcObject = e.streams[0];
				// if (!inboundStream) {
				// 	inboundStream = new MediaStream();
				// 	audioTag.srcObject = inboundStream;
				// }
				// inboundStream.addTrack(e.track);
				// const source = audioCtx.createMediaElementSource(audioTag);

				// source.connect(audioCtx.destination);

				// audioTag.play();
				// return;
				// this.visualize(analyser);
				// if (1 == '1') return;
				// var source = audioCtx.createMediaStreamSource(stream);
				// source.connect(audioCtx.destination);
				// audioRef.current.play();
			} else {
				if (!inboundStream) {
					inboundStream = new MediaStream();
					videoRef.current.srcObject = inboundStream;
				}
				inboundStream.addTrack(e.track);
			}
		};
		conn.ontrack = onTrack;
		return () => {};
	});

	while (true) {
		const track = yield take(chan);
		yield put(Actions.addTrack(id, track));
	}
}

function* watchMultiPeer() {
	const connections = {};
	const peerChan = yield actionChannel('PEER_ACTION');
	while (true) {
		const { payload, conn_id } = yield take(peerChan);
		if (!connections[conn_id]) {
			connections[conn_id] = new RTCPeerConnection(config);
			// yield put(Actions.setPeerConn(conn));
			yield spawn(addIceListener, connections[conn_id]);
			yield spawn(addTrackListener, connections[conn_id], conn_id);
			yield spawn(iceConnectionStateChange, connections[conn_id], conn_id);
		}
		yield call(handlePeerAction, connections[conn_id], payload);
		if (payload.method === 'close') {
			delete connections[conn_id];
		}
	}
}

function* handlePeerAction(conn, payload) {
	try {
		console.log('got action!');
		const { method, args } = payload;
		let result;
		if (args.length > 0) {
			result = yield conn[method].apply(conn, args);
		} else {
			result = yield conn[method]();
		}
		yield put({ type: 'PEER_ACTION_DONE', payload: result || true });
		if (method === 'close') {
			yield call(cleanPeer, conn);
		}
	} catch (e) {
		console.log('error');
		console.error(e);
		debugger; //error
	}
}

function cleanPeer(conn) {
	conn.ontrack = null;
	conn.onremovetrack = null;
	conn.onremovestream = null;
	conn.onicecandidate = null;
	conn.oniceconnectionstatechange = null;
	conn.onsignalingstatechange = null;
	conn.onicegatheringstatechange = null;
	conn.onnegotiationneeded = null;
	conn = null;
}

function* rootSaga() {
	yield all([watchMultiPeer()]);
}
export default rootSaga;
