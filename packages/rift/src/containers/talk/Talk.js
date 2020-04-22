import * as React from 'react';
import { Layout, Text, Button, withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import * as Actions from '@actions';
import Media from './Media';
import CallActions from '@components/buttons/CallActions';
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
		width: '100%',
		flexGrow: 1
	},
	callButtonContainer: {
		flexDirection: 'row',
		width: '100%'
	},
	callButton: {
		flexBasis: '50%'
	},
	video: {
		width: '100%'
	}
});

function getPeerName(peerConnection) {
	return 'localConn';
}

let connName = 'peerStore';

class Adapter extends React.PureComponent {
	constructor(props) {
		super(props);
		let audioRef = this.props.audioRef || React.createRef();
		let videoRef = React.createRef();
		let selfRef = React.createRef();
		this.audioRef = audioRef;
		this.videoRef = videoRef;
		this.selfRef = selfRef;
		this.audioFileRef = React.createRef();
		this.canvasRef = React.createRef();
		window.audioFileRef = this.audioFileRef;
		window.videoRef = this.videoRef;
		// this.getDisplayStyle = this.get
	}
	// remove just for debugging
	componentWillMount() {
		console.log('didmount');
	}
	componentWillUnmount() {
		console.log('unmount');
	}

	componentDidUpdate() {
		const { peerStore, peerConnStatus } = this.props;
		const { audioRef, videoRef } = this;
		const { conn } = peerStore;
		let inboundStream = null;

		const onTrack = e => {
			const { mediaStreamConstraints } = this.props;
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
			if (!audioRef?.current) {
				return;
			}
			if (e.streams?.[0]) {
				const stream = e.streams[0];
				// audioRef.current.srcObject = e.streams[0];
				const audioTag = new Audio();
				audioTag.srcObject = stream;
				var audioCtx = new AudioContext();
				const source = audioCtx.createMediaElementSource(audioTag);
				var analyser = audioCtx.createAnalyser();
				analyser.minDecibels = -90;
				analyser.maxDecibels = -10;
				analyser.smoothingTimeConstant = 0.85;
				source.connect(analyser);
				analyser.connect(audioCtx.destination);
				var distortion = audioCtx.createWaveShaper();
				var gainNode = audioCtx.createGain();
				// var wavesurfer = WaveSurfer.create({
				// 	container: document.querySelector('#wave'),
				// 	backend: 'MediaElementWebAudio'
				// });
				audioTag.play();
				this.visualize(analyser);
				if (1 == '1') return;
				debugger; // remove
				// var source = audioCtx.createMediaStreamSource(stream);
				// source.connect(audioCtx.destination);
				// audioRef.current.play();
				debugger; // remove
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

		if (peerConnStatus.created === true && conn.ontrack == null) {
			console.log('handlers added: ontrack and onice');
			// conn.ontrack = onTrack.bind(this);
			// conn.ontrack = onTrack.bind(this);

			// conn.addEventListener('track', e => {
			// 	console.log('on EVENT track');
			// });
			// conn.addEventListener('icecandidate', this.handleConnection.bind(this));
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
			console.log('track');
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
		// var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		// var source = audioCtx.createMediaElementSource(audioFileRef.current);
		// var dest = audioCtx.createMediaStreamDestination();
		const source = this.props.addSource(audioFileRef.current);
		debugger; //remove
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

		// const { setPeerInitiator } = this.props;
		await this.getMediaFromFile(audioConstraints);
		debugger; //remove
		setPeerInitiator(true);
		this.props.sendOffer({});
	}
	call() {
		this.props.startCallSaga('audio', {});
		// const audioConstraints = { audio: true, video: false };

		// const { peerStore } = this.props;
		// this.setMediaStreamConstraints(true, false);
		// peerStore.onicecandidate = e => {};
		// this.startCall(audioConstraints);
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
		const { peerStore, peerConnStatus } = this.props;
		const audio = (ref, onPress, key) => (
			<Layout key={key} style={[styles.callButton]}>
				{onPress ? <Button onPress={onPress}>Audio Call</Button> : null}
				{/* <audio id={`audio-${connName}`} controls autoPlay ref={ref}></audio> */}
			</Layout>
		);
		const video = (ref, onPress, key) => {
			return (
				<Layout key={key} style={[styles.callButton]}>
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
			<Layout style={styles.callButton}>
				<audio src="example.mp3"></audio>
			</Layout>
		);
		const AudioFile = (
			<Layout style={[styles.callButton, { padding: 0 }]}>
				<audio style={{ margin: 'auto' }} src="example.mp3"></audio>
			</Layout>
		);
		const audioElem = <audio src="example.mp3"></audio>;
		const fileCall = this.fileCall.bind(this);
		const callFunctions = {
			audio: this.call.bind(this),
			video: this.videoCall.bind(this)
		};
		return (
			<ScrollView
				style={{
					overflowY: 'scroll',
					// height: '85vh',
					flexGrow: 1,
					flexDirection: 'column'
				}}
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<Layout style={styles.container}>
					<Layout
						style={[
							styles.row,
							{
								padding: 0
								// height: '100%'
							}
						]}
					>
						<Media
							callFunctions={callFunctions}
							videoRef={this.videoRef}
							audioRef={this.audioRef}
						/>
					</Layout>
					<Layout
						style={[
							styles.row,
							{
								padding: 0,
								flexGrow: 0,
								flexBasis: 100
								// height: '100%'
							}
						]}
					>
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
					<CallActions />
					{/* <Layout style={[styles.row, { padding: 2 }]}>
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
					</Layout> */}
				</Layout>
			</ScrollView>
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
			dispatch(Actions.setPeerInitiator(isInitiator)),
		setStream: stream => dispatch(Actions.setStream(stream)),
		startCallSaga: type => dispatch(Actions.startCall('audio')),
		addSource: source => dispatch(Actions.addSource(source))
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
export default connect(mapStateToProps, mapDispatchToProps)(Adapter);
