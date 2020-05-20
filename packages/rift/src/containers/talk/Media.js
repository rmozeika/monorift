import * as React from 'react';
import { Layout, Button, ButtonGroup } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import * as Actions from '@actions';
import Controls from '@components/talk/Controls';
import VideoPlayer from '@components/talk/VideoPlayer';

export class Media extends React.Component {
	constructor(props) {
		super(props);
		this.state = { audioControl: null, audioControlsHidden: true };
	}
	showHideMedia = isHidden => {
		const showHideSettings = {
			hide: {
				onPress: this.hide,
				text: 'Hide'
			},
			show: {
				onPress: this.show,
				text: 'Show'
			}
		};
		const setting = isHidden ? 'show' : 'hide';
		return showHideSettings[setting];
	};

	componentDidUpdate(prevProps) {
		if (this.props.stream !== prevProps.stream) {
			this.createAudioContext(this.props.stream);
		}
	}

	createAudioContext(stream) {
		const audioControl = this.state == null ? null : this.state.audioControl;
		if (audioControl !== null) return;
		const myAudio = this.props.audioRef.current;
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var source = audioCtx.createMediaElementSource(myAudio);
		var source1 = audioCtx.createBufferSource();
		this.setState({ audioControl: source1 });
		source.connect(audioCtx.destination);
		audioCtx.suspend();
	}
	play = () => {
		this.props.audioRef.current.play();
	};
	stop = () => {
		this.props.audioRef.current.pause();
	};
	live = () => {
		this.props.audioRef.current.seekable.end();
	};
	hide = () => {
		this.setState({ audioControlsHidden: true });
	};
	show = () => {
		this.setState({ audioControlsHidden: false });
	};
	render() {
		const { videoRef, audioRef } = this.props;
		const { audioControlsHidden } = this.state;
		const audioStyle = audioControlsHidden
			? { display: 'none' }
			: { margin: 'auto' };
		return (
			<Layout style={styles.container}>
				<VideoPlayer videoRef={videoRef} />
				<Layout style={styles.row}>
					<audio style={audioStyle} id={`audio-1`} controls ref={audioRef}></audio>
				</Layout>
				<Layout style={styles.buttonRow}>
					<Controls
						callFunctions={this.props.callFunctions}
						showHideMedia={this.showHideMedia}
						audioControlsHidden={this.state.audioControlsHidden}
						play={this.play}
						stop={this.stop}
					/>
				</Layout>
			</Layout>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		// height: '100%',
		justifyContent: 'space-between'
	},
	row: {
		width: '100%',
		flexGrow: 1
	},
	buttonRow: {
		width: '100%',
		flexGrow: 1,
		flexBasis: '45%',
		maxHeight: '50%'
	},
	video: {
		width: '100%'
	}
});

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
	const { created, handlersAttached, conn, stream } = peerStore;
	return {
		stream,
		peerStore,
		conn,
		peerConnStatus: { created, handlersAttached },
		mediaStreamConstraints: constraints.mediaStream
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Media);
