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
// import * as Action from '@actions';
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
function handleConnection(event) {
	console.log('got candidate onicecandidate event');
	const peerConnection = event.target;
	const iceCandidate = event.candidate;

	if (iceCandidate && event.currentTarget.remoteDescription !== null) {
		const newIceCandidate = new RTCIceCandidate(iceCandidate);
		console.log('sending candidate');
		this.props.sendCandidate(newIceCandidate);
	}
}
function* tickChannel() {
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
}
// function* peerCaller() {
// 	const conn = new RTCPeerConnection(config);
// 	let result;
// 	while (true) {
// 		result = yield result + 1;
// 	}
// }
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
function* watchPeer() {
	const conn = new RTCPeerConnection(config);
	conn.ontrack = onTrack;
	yield put(Actions.setPeerConn(conn));
	yield spawn(addIceListener, conn);
	// const chan = yield call(channel)
	const peerChan = yield actionChannel('PEER_ACTION');
	while (true) {
		// 2- take from the channel
		const { payload } = yield take(peerChan);
		// 3- Note that we're using a blocking call
		yield call(handlePeerAction, conn, payload);
	}
	// create 3 worker 'threads'
	// for (var i = 0; i < 3; i++) {
	//   yield fork(handleRequest, chan)
	// }

	// while (true) {
	//   const {payload} = yield take('REQUEST')
	//   yield put(chan, payload)
	// }
}

function* handlePeerAction(conn, payload) {
	console.log('got action!');
	// return 'yay';
	const { method, args } = payload;
	let result;
	if (args.length > 0) {
		result = yield conn[method].apply(conn, args);
	} else {
		result = yield conn[method]();
	}
	yield put({ type: 'PEER_ACTION_DONE', payload: result || true });
}
function* createPeerConnSaga(action) {
	const { config } = action;
	try {
		const conn = new RTCPeerConnection(config);
		// conn.ontrack =ontrack);
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
const audioTag = new Audio();
const audioCtx = new AudioContext();
let inboundStream;
function* configurePeerConnSaga(action) {}
const onTrack = e => {
	// CHANGE THIS select from store;
	// const { mediaStreamConstraints } = this.props;
	const mediaStreamConstraints = { audio: true, video: false };
	console.log('ONTRACK called', e);
	console.log('on track ID', e.track.id);

	if (mediaStreamConstraints.video && e.track.kind == 'video') {
		if (!videoRef?.current) {
			return;
		}
		if (e.streams?.[0]) {
			videoRef.current.srcObject = e.streams[0];
			videoRef.current.muted = true;
		} else {
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
		// audioRef.current.srcObject = e.streams[0];
		if (!inboundStream) {
			inboundStream = new MediaStream();
			audioTag.srcObject = inboundStream;
		}
		inboundStream.addTrack(e.track);
		// audioTag.srcObject = stream;
		const source = audioCtx.createMediaElementSource(audioTag);
		// var analyser = audioCtx.createAnalyser();
		// analyser.minDecibels = -90;
		// analyser.maxDecibels = -10;
		// analyser.smoothingTimeConstant = 0.85;
		// source.connect(analyser);
		source.connect(audioCtx.destination);
		// var distortion = audioCtx.createWaveShaper();
		// var gainNode = audioCtx.createGain();
		// var wavesurfer = WaveSurfer.create({
		// 	container: document.querySelector('#wave'),
		// 	backend: 'MediaElementWebAudio'
		// });
		audioTag.play();
		return;
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

	// if (e.track.kind == 'audio') {
	// 	audioRef.current.srcObject = e.streams[0];
	// this.props.setStream(e.streams[0]);
	// }
	// let audio = audioRef.current;
	// audio.play();
};

function* rootSaga() {
	yield all([watchPeer()]);
	// yield
	//  all([takeLatest(Actions.SET_PEER_CONN, configurePeerConnSaga)]);
}
export default rootSaga;
