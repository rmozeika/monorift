import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	ButtonGroup
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	row: {
		width: '100%'
	},
	buttonRow: {
		width: '100%',
		margin: 8
	},
	video: {
		width: '100%'
	},
	controlButton: {
		flexGrow: 1,
		flexBasis: 40
	},
	buttonGroup: {
		display: 'flex',
		flexDirection: 'row',
		width: '90%',
		margin: 'auto'
	}
});
function ShowHideButton(props) {
	const { onPress, text, style, ...otherProps } = props;
	return (
		<Button
			style={[styles.controlButton, style]}
			onPress={onPress}
			{...otherProps}
		>
			{text}
		</Button>
	);
}
class Media extends React.Component {
	constructor(props) {
		super(props);
		this.state = { audioControl: null, audioControlsHidden: false };
	}
	showHideProps(isHidden) {
		const showHideSettings = {
			hide: {
				onPress: this.hide.bind(this),
				text: 'Hide'
			},
			show: {
				onPress: this.show.bind(this),
				text: 'Show'
			}
		};
		const setting = isHidden ? 'show' : 'hide';
		return showHideSettings[setting];
	}

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
	play() {
		this.props.audioRef.current.play();
	}
	stop() {
		this.props.audioRef.current.pause();
	}
	hide() {
		this.setState({ audioControlsHidden: true });
	}
	show() {
		this.setState({ audioControlsHidden: false });
	}
	render() {
		const { videoRef, audioRef } = this.props;
		const { audioControlsHidden } = this.state;
		const audioStyle = audioControlsHidden
			? { display: 'none' }
			: { margin: 'auto' };
		return (
			<Layout style={styles.container}>
				<Layout style={styles.row}>
					<video
						style={{ width: '100%', margin: 'auto' }}
						autoPlay
						playsInline
						ref={videoRef}
					/>
				</Layout>
				<Layout style={styles.row}>
					<audio style={audioStyle} id={`audio-1`} controls ref={audioRef}></audio>
				</Layout>
				<Layout style={styles.buttonRow}>
					<ButtonGroup style={styles.buttonGroup} appearance="outline">
						{/* <Button onPress={this.createAudioContext.bind(this)}>Start</Button> */}
						<Button style={styles.controlButton} onPress={this.play.bind(this)}>
							Play
						</Button>
						<Button style={styles.controlButton} onPress={this.stop.bind(this)}>
							Stop
						</Button>
						<ShowHideButton
							{...this.showHideProps(audioControlsHidden)}
						></ShowHideButton>
					</ButtonGroup>
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
