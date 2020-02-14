import * as React from 'react';
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center'
	},
	row: {
		// flex: 1
		// padding: 15,
		width: '100%'
	},
	video: {
		// backgroundColor: 'blue',
		width: '100%'
		// height: 200
	}
});

class Media extends React.Component {
	constructor(props) {
		super(props);
		this.setState({ audioControl: null });
		// // let audioRef = React.createRef();
		// let audioRef = this.props.audioRef;
		// let videoRef = React.createRef();
		// let selfRef = React.createRef();
		// this.audioRef = audioRef;
		// this.videoRef = videoRef;
		// this.selfRef = selfRef;
		// this.audioFileRef = React.createRef();
		// window.audioFileRef = this.audioFileRef;
		// window.videoRef = this.videoRef;
	}
	createAudioContext(node) {
		debugger;
		const audioControl = this.state == null ? null : this.state.audioControl;
		if (audioControl !== null) return;
		debugger;
		const myAudio = this.props.audioRef.current;
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var source = audioCtx.createMediaElementSource(myAudio);
		// gainNode.connect(audioCtx.destination);
		var source1 = audioCtx.createBufferSource();
		this.setState({ audioControl: source1 });
		source1.connect(audioCtx.destination);
		// source1.start(0);
	}
	play() {
		this.state.audioControl.start(0);
	}
	render() {
		const { videoRef, audioRef } = this.props;
		return (
			<Layout style={styles.container}>
				<Layout style={styles.row}>
					<video style={{ width: '100%' }} autoPlay playsInline ref={videoRef} />
				</Layout>
				<Layout style={styles.row}>
					<audio id={`audio-1`} controls autoPlay ref={audioRef}></audio>
				</Layout>
				<Layout style={styles.row}>
					<Button onPress={this.createAudioContext.bind(this)}>Start</Button>
					<Button onPress={this.play.bind(this)}>Play</Button>
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
export default connect(mapStateToProps, mapDispatchToProps)(Media);
