import * as React from 'react';
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';

const trace = msg => {
	console.log(msg);
};
const mediaStreamConstraints = {
	audio: true
};

// Set up to exchange only video.
const offerOptions = {
	// offerToReceiveVideo: 1,
};

function handleConnection(event) {
	const peerConnection = event.target;
	const iceCandidate = event.candidate;

	if (iceCandidate) {
		const newIceCandidate = new RTCIceCandidate(iceCandidate);
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
function createdOffer(description, localPeerConnection, remotePeerConnection) {
	trace(`Offer from localPeerConnection:\n${description.sdp}`);

	trace('localPeerConnection setLocalDescription start.');
	localPeerConnection
		.setLocalDescription(description)
		.then(() => {
			setLocalDescriptionSuccess(localPeerConnection);
		})
		.catch(setSessionDescriptionError);

	trace('remotePeerConnection setRemoteDescription start.');
	remotePeerConnection
		.setRemoteDescription(description)
		.then(() => {
			setRemoteDescriptionSuccess(remotePeerConnection);
		})
		.catch(setSessionDescriptionError);

	trace('remotePeerConnection createAnswer start.');
	remotePeerConnection
		.createAnswer()
		.then(desc => {
			createdAnswer(desc, localPeerConnection, remotePeerConnection);
		})
		.catch(setSessionDescriptionError);
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
	}
});
let conn1;
let conn2;
// const FancyAudio = React.forwardRef((props, ref) => (
// 	<Audio ref={ref} className="FancyButton">
// 		{props.children}
// 	</Audio>
// ));

// // You can now get a ref directly to the DOM button:
// const ref = React.createRef();
// <FancyButton ref={ref}>
// 	<Audio></Audio>
// </FancyButton>;

// function logProps(Component) {
// 	class LogProps extends Audio {
// 		// ...
// 	}

// 	function forwardRef(props, ref) {
// 		return <LogProps {...props} forwardedRef={ref} />;
// 	}

// 	// Give this component a more helpful display name in DevTools.
// 	// e.g. "ForwardRef(logProps(MyComponent))"
// 	const name = Component.displayName || Component.name;
// 	forwardRef.displayName = `logProps(${name})`;

// 	return React.forwardRef(forwardRef);
// }

function getPeerName(peerConnection) {
	return peerConnection === conn1 ? 'conn1' : 'conn2';
}

let connName = 'conn1';
let connName2 = 'conn2';
let audioRef = React.createRef();
let audioRef2 = React.createRef();

class Adapter extends React.Component {
	constructor(props) {
		super(props);
	}
	call() {
		const conn1 = new RTCPeerConnection();
		const conn2 = new RTCPeerConnection();
		// const localAudio = document.querySelector('audio');
		// const localAudio2 = document.querySelector('audio');
		conn1.ontrack = onTrack;
		conn2.ontrack = onTrack2;

		function onTrack(e) {
			debugger;
			let audio = audioRef.current;
			// localAudio.audioRef.srcObject = track;
			if (audio.srcObject !== e.streams[0]) {
				srcObject = e.streams[0];
			}
			console.log(audioRef.current.srcObject);
			audio.play();
		};
		
		function onTrack2(e) {
			debugger;
			let audio = audioRef2.current;

			if (audio.srcObject !== e.streams[0]) {
				srcObject = e.streams[0];
			}
			console.log(audioRef.current.srcObject);

		};
		// const signaling = new SignalingChannel();
		// conn1.onicecandidate = ({ candidate }) => {
		// 	signaling.send({ candidate });
		// };
		console.log(conn1);

		async function getMedia(constraints, conn) {
			let stream = null;

			try {
				stream = await navigator.mediaDevices.getUserMedia(constraints);
				const audioTracks = stream.getAudioTracks();
				console.log('Got stream with constraints:', constraints);
				console.log('Using audio device: ' + audioTracks[0].label);
				stream.oninactive = function() {
				  console.log('Stream ended');
				};
				audioRef.current.srcObject = stream;
				window.stream = stream; // make variable available to browser console
				// for (const track of stream.getTracks()) {
				// 	conn.addTrack(track, stream);
				// }
				//conn.addStream(stream);
				/* use the stream */
			} catch (err) {
				debugger;
				console.log(err);
				/* handle the error */
			}
		}
		async function attachHandlers(conn, other) {
			conn.other = other;
			conn.addEventListener('icecandidate', handleConnection);
		}
		const run = async () => {
			await getMedia({ audio: true, video: false }, conn1, conn2);
			// await getMedia({ audio: true, video: false }, conn2, conn1);

			conn1
				.createOffer(offerOptions)
				.then(desc => {
					return createdOffer(desc, conn1, conn2);
				})
				.catch(setSessionDescriptionError);
		};
		run();
	}
	render() {
		return (
			<Layout style={styles.container}>
				<Layout style={styles.row}>
					<Button onPress={this.call}>Call</Button>
					<audio id={`audio-${connName}`} controls autoplay ref={audioRef}></audio>
                	<audio id={`audio-${connName2}`} controls autoplay ref={audioRef2}></audio>	
				</Layout>
			</Layout>
		);
	}
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {};
};

export default connect(state => state, mapDispatchToProps)(Adapter);
