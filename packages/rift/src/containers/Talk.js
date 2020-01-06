import * as React from 'react';
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';
const trace = msg => {
	console.log(msg);
};
let mediaStreamConstraints = {
	audio: true,
	video: false
};

// Set up to exchange only video.
const offerOptions = {
	// offerToReceiveVideo: 1,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center'
	},
	row: {
		// flex: 1
		//backgroundColor: 'red',
		padding: 15,
		width: '100%'
	},
	row2: {
		// flex: 1
		//backgroundColor: 'red',
		padding: 15,
		width: '100%'
	},
	bigBlue: {
		//backgroundColor: 'blue',
		flexGrow: 5
	},
	video: {
		backgroundColor: 'blue',
		width: '100%',
		height: 200
	}
});
// let peerStore;

function getPeerName(peerConnection) {
	return 'localConn';
}

let connName = 'peerStore';
// let connName2 = 'conn2';
// let audioRef = React.createRef();
// let videoRef = React.createRef();
// let selfRef = React.createRef();

class Adapter extends React.Component {
	constructor(props) {
		super(props);
		let audioRef = React.createRef();
		let videoRef = React.createRef();
		let selfRef = React.createRef();
		this.audioRef = audioRef;
		this.videoRef = videoRef;
		this.selfRef = selfRef;
		this.audioFileRef = React.createRef();
		window.audioFileRef = this.audioFileRef;
		window.videoRef = this.videoRef;
	}
	componentDidMount() {
		//this.peerStore = new RTCPeerConnection();
		this.props.createPeerConn({
			iceServers: [
				{
					urls: 'stun:stun.l.google.com:19302'
				}
			]
		});
	}
	componentDidUpdate() {
		const { peerStore, peerConnStatus } = this.props;
		const { audioRef, videoRef } = this;
		const { conn } = peerStore;
		const onTrack = e => {
			const { mediaStreamConstraints } = this.props;
			debugger; //REMOVE
			console.log('ONTRACK called', e);
			// if (mediaStreamConstraints.video) {
			if (mediaStreamConstraints.video) {
				if (!(videoRef && videoRef.current)) {
					return;
				}
				if (videoRef.current.srcObject !== null) {
					return;
				}
				videoRef.current.srcObject = e.streams[0];
				return;
			}
			if (!(audioRef && audioRef.current)) {
				return;
			}
			if (audioRef.current.srcObject) return;
			//videoRef.current.srcObject = e.streams[0];
			if (e.track.kind == 'audio') {
				audioRef.current.srcObject = e.streams[0];
			}
			let audio = audioRef.current;
			// // localAudio.audioRef.srcObject = track;
			// if (audio.srcObject !== e.streams[0]) {
			// 	srcObject = e.streams[0];
			// }
			// console.log(audioRef.current.srcObject);
			audio.play();
		};

		if (peerConnStatus.created === true && conn.ontrack == null) {
			console.log('handlers added: ontrack and onice');
			conn.ontrack = onTrack;
			conn.addEventListener('track', e => {
				console.log('on EVENT track');
			});
			// conn.onaddstream = handleRemoteStreamAdded;
			conn.addEventListener('icecandidate', this.handleConnection.bind(this));
		}
	}
	setMediaStreamConstraints(audio, video) {
		const { setConstraints } = this.props;
		// let mediaStreamConstraints = constraints.mediaStream;
		mediaStreamConstraints = { audio, video };
		setConstraints({ mediaStream: mediaStreamConstraints });
	}
	async getMedia(constraints, alternateConn) {
		debugger; //REMOVE
		let stream = null;
		const { peerStore } = this.props;
		const { conn } = peerStore;
		try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);
			const audioTracks = stream.getAudioTracks();
			console.log('Got stream with constraints:', constraints);
			console.log('Using audio device: ' + audioTracks[0].label);
			stream.oninactive = function() {
				console.log('Stream ended');
			};
			stream.getTracks().forEach(track => {
				console.log('adding track', 'from getMedia after call');
				conn.addTrack(track, stream);
			});
			if (mediaStreamConstraints.video) {
				// this.selfRef.current.srcObject = stream;
			}
			//stream.addTrack(stream)
			//selfRef.current.srcObject = stream;
			// audioRef.current.srcObject = stream;
			window.stream = stream; // make variable available to browser console
		} catch (err) {
			console.log(err);
			/* handle the error */
		}
	}
	async startCall(constraints) {
		const { peerStore, setPeerInitiator } = this.props;
		await this.getMedia(constraints);
		setPeerInitiator(true);
		this.props.sendOffer({}); //{ constraints }); //mediaStreamConstraints });
	}
	videoCall() {
		const { peerStore } = this.props;
		const videoConstraints = { audio: true, video: true };
		this.setMediaStreamConstraints(true, true);
		this.startCall(videoConstraints);
	}
	call() {
		const audioConstraints = { audio: true, video: false };

		const { peerStore } = this.props;
		this.setMediaStreamConstraints(true, false);
		// peerStore.conn.addEventListener('icecandidate', this.handleConnection.bind(this));
		peerStore.onicecandidate = e => {};
		this.startCall(audioConstraints);
	}
	handleConnection(event) {
		console.log('got candidate onicecandidate event');
		const peerConnection = event.target;
		const iceCandidate = event.candidate;

		if (iceCandidate) {
			const newIceCandidate = new RTCIceCandidate(iceCandidate);
			console.log('sending candidate');
			this.props.sendCandidate(newIceCandidate);
		}
	}
	render() {
		const { peerStore, peerConnStatus } = this.props;
		const audio = (ref, onPress, key) => (
			<Layout key={key} style={styles.row}>
				{onPress ? <Button onPress={onPress}>Call</Button> : null}
				<audio id={`audio-${connName}`} controls autoPlay ref={ref}></audio>
			</Layout>
		);
		const video = (ref, onPress, key) => {
			return (
				<Layout key={key} styles={styles.row2}>
					{onPress ? <Button onPress={onPress}>Call</Button> : null}
					<video styles={styles.video} autoPlay muted playsInline ref={ref} />
				</Layout>
			);
		};
		const elements = [
			{
				type: 'audio',
				handler: this.call.bind(this),
				ref: this.audioRef,
				key: 'audio-1'
			},
			{
				type: 'video',
				handler: this.videoCall.bind(this),
				ref: this.videoRef,
				key: 'video-1'
			},
			{ type: 'video', handler: false, ref: this.selfRef, key: 'video-2' }
		];

		const loading = (
			<Layout style={styles.row}>
				<Text>Loading...</Text>
			</Layout>
		);
		const toDisplay = () => {
			if (peerConnStatus.created !== true) {
				return loading;
			}
			const avComponentMap = { audio: audio, video: video };
			const audioVideo = elements.map(({ type, handler, ref, key }) => {
				const AVtype = avComponentMap[type];
				return AVtype(ref, handler, key);
			});
			return audioVideo;
		};
		const AudioFileFunc = () => (
			<Layout style={styles.row}>
				<audio src="example.mp3"></audio>
			</Layout>
		);
		const AudioFile = (
			<Layout style={styles.row}>
				<audio src="example.mp3"></audio>
			</Layout>
		);
		const audioElem = <audio src="example.mp3"></audio>;
		return (
			<Layout style={styles.container}>
				{toDisplay()}
				<Layout style={styles.row}>
					<audio
						ref={this.audioFileRef}
						src={`/example.mp3?${Math.random()
							.toString()
							.substr(2)}`}
						type="audio/mpeg"
						controls
					></audio>
				</Layout>
			</Layout>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		sendCandidate: candidate => dispatch(Actions.sendCandidate(candidate)),
		createPeerConn: config => dispatch(Actions.createPeerConn(config)),
		sendOffer: message => dispatch(Actions.sendOffer(message)),
		setConstraints: ({ mediaStream }) =>
			dispatch(Actions.setConstraints({ mediaStream })),
		setPeerInitiator: isInitiator =>
			dispatch(Actions.setPeerInitiator(isInitiator))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { call } = state;
	const { peerStore, constraints } = call;
	const { created, handlersAttached, conn } = peerStore;
	return {
		peerStore,
		conn,
		peerConnStatus: { created, handlersAttached },
		mediaStreamConstraints: constraints.mediaStream
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Adapter);
