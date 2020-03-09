import * as React from 'react';
import { Layout, Text, Button, withStyles } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';
import Media from './Media';

const trace = msg => {
	console.log(msg);
};
let mediaStreamConstraints = {
	audio: true,
	video: false
};
const offerOptions = {};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	row: {
		padding: 15,
		width: '100%'
	},
	video: {
		width: '100%'
	}
});

function getPeerName(peerConnection) {
	return 'localConn';
}

let connName = 'peerStore';

class Adapter extends React.Component {
	constructor(props) {
		super(props);
		let audioRef = this.props.audioRef;
		let videoRef = React.createRef();
		let selfRef = React.createRef();
		this.audioRef = audioRef;
		this.videoRef = videoRef;
		this.selfRef = selfRef;
		this.audioFileRef = React.createRef();
		window.audioFileRef = this.audioFileRef;
		window.videoRef = this.videoRef;
		// this.getDisplayStyle = this.get
	}
	componentDidMount() {
		// this.props.createPeerConn({
		// 	iceServers: [
		// 		{
		// 			urls: 'stun:stun.l.google.com:19302'
		// 		},
		// 		{
		// 			urls: 'turn:monorift:78?transport=udp',
		// 			credential: '0x054c7df422cd6b99b6f6cae2c0bdcc14',
		// 			username: 'rtcpeer'
		// 		}
		// 	]
		// });
	}
	componentDidUpdate() {
		const { peerStore, peerConnStatus } = this.props;
		const { audioRef, videoRef } = this;
		const { conn } = peerStore;
		const onTrack = e => {
			debugger; //remove
			const { mediaStreamConstraints } = this.props;
			console.log('ONTRACK called', e);
			console.log('on track ID', e.track.id);

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
			if (e.track.kind == 'audio') {
				audioRef.current.srcObject = e.streams[0];
				this.props.setStream(e.streams[0]);
			}
			let audio = audioRef.current;
			audio.play();
		};

		if (peerConnStatus.created === true && conn.ontrack == null) {
			console.log('handlers added: ontrack and onice');
			conn.ontrack = onTrack.bind(this);
			conn.addEventListener('track', e => {
				console.log('on EVENT track');
			});
			conn.addEventListener('icecandidate', this.handleConnection.bind(this));
		}
	}
	setMediaStreamConstraints(audio, video) {
		const { setConstraints } = this.props;
		mediaStreamConstraints = { audio, video };
		setConstraints({ mediaStream: mediaStreamConstraints });
	}
	gotMedia(stream) {
		const { peerStore, mediaStreamConstraints } = this.props;
		const { conn } = peerStore;
		const audioTracks = stream.getAudioTracks();
		console.log('Using audio device: ' + audioTracks[0].label);
		stream.oninactive = function() {
			console.log('Stream ended');
		};
		stream.getTracks().forEach(track => {
			console.log('adding track', 'from getMedia after call');
			console.log('added track ID', track.id);
			conn.addTrack(track, stream);
		});
	}
	async getMedia(constraints, alternateConn) {
		let stream = null;
		const { peerStore } = this.props;
		const { conn } = peerStore;
		try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);
			window.stream = stream; // make variable available to browser console
			this.gotMedia(stream);
		} catch (err) {
			console.log(err);
			/* handle the error */
		}
	}
	async getMediaFromFile() {
		const { audioFileRef } = this;
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var source = audioCtx.createMediaElementSource(audioFileRef.current);
		var dest = audioCtx.createMediaStreamDestination();

		source.connect(dest);
		var stream = dest.stream;
		audioFileRef.current.play();
		window.stream = stream; // make variable available to browser console
		this.gotMedia(stream);
	}
	async startCall(constraints) {
		const { peerStore, setPeerInitiator } = this.props;
		await this.getMedia(constraints);
		setPeerInitiator(true);
		this.props.sendOffer({});
	}
	videoCall() {
		const { peerStore } = this.props;
		const videoConstraints = { audio: true, video: true };
		this.setMediaStreamConstraints(true, true);
		this.startCall(videoConstraints);
	}
	async fileCall() {
		const audioConstraints = { audio: true, video: false };

		const { peerStore } = this.props;
		this.setMediaStreamConstraints(true, false);
		peerStore.onicecandidate = e => {};

		const { setPeerInitiator } = this.props;
		await this.getMediaFromFile(audioConstraints);
		setPeerInitiator(true);
		this.props.sendOffer({});
	}
	call() {
		const audioConstraints = { audio: true, video: false };

		const { peerStore } = this.props;
		this.setMediaStreamConstraints(true, false);
		peerStore.onicecandidate = e => {};
		this.startCall(audioConstraints);
	}
	handleConnection(event) {
		console.log('got candidate onicecandidate event');
		const peerConnection = event.target;
		const iceCandidate = event.candidate;

		if (iceCandidate && event.currentTarget.remoteDescription !== null) {
			const newIceCandidate = new RTCIceCandidate(iceCandidate);
			console.log('sending candidate');
			this.props.sendCandidate(newIceCandidate);
		}
	}
	render() {
		const { peerStore, peerConnStatus, themedStyle } = this.props;
		const audio = (ref, onPress, key) => (
			<Layout key={key} style={[styles.row, { padding: 2 }]}>
				{onPress ? (
					<Button appearance="outline" onPress={onPress}>
						Audio Call
					</Button>
				) : null}
				{/* <audio id={`audio-${connName}`} controls autoPlay ref={ref}></audio> */}
			</Layout>
		);
		const video = (ref, onPress, key) => {
			return (
				<Layout key={key} style={[styles.row, { padding: 2 }]}>
					{onPress ? <Button onPress={onPress}>Video Call</Button> : null}
					{/* <video style={{ width: '100%' }} autoPlay muted playsInline ref={ref} /> */}
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
			}
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
			<Layout style={[styles.row, { padding: 0 }]}>
				<audio style={{ margin: 'auto' }} src="example.mp3"></audio>
			</Layout>
		);
		const audioElem = <audio src="example.mp3"></audio>;
		const fileCall = this.fileCall.bind(this);
		return (
			<ScrollView
				style={{
					overflowY: 'scroll',
					height: '85vh',
					flexGrow: 1,
					flexDirection: 'column'
				}}
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<Layout style={styles.container}>
					<Layout style={[styles.row, { padding: 0 }]}>
						<Media videoRef={this.videoRef} audioRef={this.audioRef} />
					</Layout>
					{toDisplay()}
					<Layout style={[styles.row, { padding: 2 }]}>
						<Button onPress={fileCall} appearance="outline" status="warning">
							Stream Audio from File
						</Button>
						<audio
							ref={this.audioFileRef}
							src={`/example.mp3?${Math.random()
								.toString()
								.substr(2)}`}
							type="audio/mpeg"
							controls
							style={{ margin: 'auto' }}
						></audio>
					</Layout>
				</Layout>
			</ScrollView>
		);
	}
}
const AdapterWithStyles = withStyles(Adapter, theme => ({
	container: {
		backgroundColor: theme['color-basic-500']
	}
}));
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		sendCandidate: candidate => dispatch(Actions.sendCandidate(candidate)),
		createPeerConn: config => dispatch(Actions.createPeerConn(config)),
		sendOffer: message => dispatch(Actions.sendOffer(message)),
		setConstraints: ({ mediaStream }) =>
			dispatch(Actions.setConstraints({ mediaStream })),
		setPeerInitiator: isInitiator =>
			dispatch(Actions.setPeerInitiator(isInitiator)),
		setStream: stream => dispatch(Actions.setStream(stream))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { call, view } = state;
	const { mobile, tab } = view;
	const { peerStore, constraints } = call;
	const { created, handlersAttached, conn } = peerStore;
	return {
		peerStore,
		conn,
		peerConnStatus: { created, handlersAttached },
		mediaStreamConstraints: constraints.mediaStream,
		mobile,
		tab
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(AdapterWithStyles);
