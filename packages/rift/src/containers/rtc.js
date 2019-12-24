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
		padding: 15
	},
	bigBlue: {
		//backgroundColor: 'blue',
		flexGrow: 5
	},
	video: {
		backgroundColor: 'blue',
		width: 200,
		height: 200
	}
});
let peerConn;

function getPeerName(peerConnection) {
	return 'localConn';
}

let connName = 'peerConn';
// let connName2 = 'conn2';
let audioRef = React.createRef();
let videoRef = React.createRef();
let selfRef = React.createRef();

class Adapter extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		//this.peerConn = new RTCPeerConnection();
		this.props.createPeerConn({});
	}
	componentDidUpdate() {
		const { peerConn, peerConnStatus } = this.props;
		function onTrack(e) {
			console.log('ONTRACK: ADDED TRACK');
			if (audioRef.current.srcObject) return;
			debugger;
			//videoRef.current.srcObject = e.streams[0];
			if (e.track.kind == 'audio') {
				debugger;
				audioRef.current.srcObject = e.streams[0];
			}
			let audio = audioRef.current;
			// // localAudio.audioRef.srcObject = track;
			// if (audio.srcObject !== e.streams[0]) {
			// 	srcObject = e.streams[0];
			// }
			// console.log(audioRef.current.srcObject);
			audio.play();
		}
		if (peerConnStatus === true) {
			peerConn.ontrack = onTrack;
		}
	}
	setMediaStreamConstraints(audio, video) {
		const { setConstraints } = this.props;
		// let mediaStreamConstraints = constraints.mediaStream;
		mediaStreamConstraints = { audio, video };
		setConstraints({ mediaStream: mediaStreamConstraints });
	}
	async getMedia(constraints, alternateConn) {
		debugger;
		let stream = null;
		const { peerConn, mediaStreamConstraints } = this.props;
		const conn = alternateConn || peerConn;
		try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);
			const audioTracks = stream.getAudioTracks();
			console.log('Got stream with constraints:', constraints);
			console.log('Using audio device: ' + audioTracks[0].label);
			stream.oninactive = function() {
				console.log('Stream ended');
			};
			stream.getTracks(track => {
				debugger;
				peerConn.addTrack(track);
			});
			//stream.addTrack(stream)
			//selfRef.current.srcObject = stream;
			// audioRef.current.srcObject = stream;
			window.stream = stream; // make variable available to browser console
		} catch (err) {
			console.log(err);
			/* handle the error */
		}
	}
	call() {
		const { peerConn } = this.props;
		this.setMediaStreamConstraints(true, false).bind(this);
		console.log(peerConn);
		debugger;

		const attachHandlers = async (conn, other) => {
			//conn.other = other;
			conn.addEventListener('icecandidate', this.handleConnection);
		};
		const run = async () => {
			await this.getMedia({ audio: true, video: false });
			// await getMedia({ audio: true, video: false }, conn2, peerConn);
			peerConn
				.createOffer(offerOptions)
				.then(desc => {
					return createdOffer(desc, peerConn);
				})
				.then(this.props.sendOffer)
				.catch(setSessionDescriptionError);
		};
		run();
	}
	handleConnection(event) {
		debugger;
		const peerConnection = event.target;
		const iceCandidate = event.candidate;

		if (iceCandidate) {
			const newIceCandidate = new RTCIceCandidate(iceCandidate);
			this.props.sendCandidate(newIceCandidate);
		}
	}
	render() {
		const { peerConn, peerConnStatus } = this.props;
		const peerCreated = (
			<Layout style={styles.row}>
				<Button onPress={this.call.bind(this)}>Call</Button>
				<audio id={`audio-${connName}`} controls autoPlay ref={audioRef}></audio>
				<video
					styles={styles.video}
					autoPlay
					muted
					playsInline
					ref={selfRef}
				></video>
				<video
					styles={styles.video}
					autoPlay
					muted
					playsInline
					ref={videoRef}
				></video>
			</Layout>
		);
		const loading = (
			<Layout style={styles.row}>
				<Text>Loading...</Text>
			</Layout>
		);
		const toDisplay = peerConnStatus === true ? peerCreated : loading;
		return <Layout style={styles.container}>{toDisplay}</Layout>;
	}
}

// unused
function handleConnection(event) {
	const peerConnection = event.target;
	const iceCandidate = event.candidate;
	if (iceCandidate) {
		const newIceCandidate = new RTCIceCandidate(iceCandidate);
		if (true) return;
		const otherPeer = getOtherPeer(peerConnection);

		otherPeer
			.addIceCandidate(newIceCandidate)
			.then(() => {
				handleConnectionSuccess(peerConnection);
			})
			.catch(error => {
				handleConnectionFailure(peerConnection, error);
			});

		trace(
			`${getPeerName(peerConnection)} ICE candidate:\n` +
				`${event.candidate.candidate}.`
		);
	}
}

// Logs offer creation and sets peer connection session descriptions.
function createdOffer(description, localPeerConnection) {
	trace(`Offer from localPeerConnection:\n${description.sdp}`);

	trace('localPeerConnection setLocalDescription start.');
	localPeerConnection
		.setLocalDescription(description)
		.then(() => {
			setLocalDescriptionSuccess(localPeerConnection);
		})
		.catch(setSessionDescriptionError);
	return description;
	trace('remotePeerConnection setRemoteDescription start.');
	// remotePeerConnection
	// 	.setRemoteDescription(description)
	// 	.then(() => {
	// 		setRemoteDescriptionSuccess(remotePeerConnection);
	// 	})
	// 	.catch(setSessionDescriptionError);

	trace('remotePeerConnection createAnswer start.');
	// remotePeerConnection
	// 	.createAnswer()
	// 	.then(desc => {
	// 		createdAnswer(desc, localPeerConnection, remotePeerConnection);
	// 	})
	// 	.catch(setSessionDescriptionError);
}

// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description, localPeerConnection, remotePeerConnection) {
	trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

	trace('remotePeerConnection setLocalDescription start.');
	remotePeerConnection
		.setLocalDescription(description)
		.then(() => {
			setLocalDescriptionSuccess(remotePeerConnection);
		})
		.catch(setSessionDescriptionError);

	trace('localPeerConnection setRemoteDescription start.');
	localPeerConnection
		.setRemoteDescription(description)
		.then(() => {
			setRemoteDescriptionSuccess(localPeerConnection);
		})
		// .catch(setSessionDescriptionError);
		.catch(trace);
}

// Logs error when setting session description fails.
function setSessionDescriptionError(error) {
	trace(`Failed to create session description: ${error.toString()}.`);
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
	const peerName = getPeerName(peerConnection);
	trace(`${peerName} ${functionName} complete.`);
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
	setDescriptionSuccess(peerConnection, 'setLocalDescription');
}

// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
	setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		sendCandidate: candidate => dispatch(Actions.sendCandidate(candidate)),
		createPeerConn: config => dispatch(Actions.createPeerConn(config)),
		sendOffer: message => dispatch(Actions.sendOffer(message)),
		setConstraints: ({ mediaStream }) =>
			dispatch(Actions.setConstraints({ mediaStream }))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { call } = state;
	const { peerConn, constraints } = call;
	return {
		peerConn: peerConn.conn,
		peerConnStatus: peerConn.created,
		mediaStreamConstraints: constraints.mediaStream
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Adapter);
