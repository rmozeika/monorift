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
import * as Actions from '../actions';
const outerButtonGroupBoxShadow = {
	boxShadow: `
			inset 5px 5px 5px -15px rgba(0,0,0,0.1), 
			inset -5px -5px 7px -15px rgba(255, 255, 255, 0.4), 
			-5px -5px 16px rgba(255, 255,255, 0.1), 
			15px 15px 10px rgba(0,0,0,0.5)
		`
};
const controlButtonBoxShadow = `inset 10px 10px 10px rgba(0,0,0,.1), inset -10px -10px 5px rgba(0,0,0,.1), inset -10px 10px 5px rgba(0,0,0,.1), inset 10px -10px 10px rgba(0,0,0,.1)`;
const buttonGroupBoxShadow = {
	boxShadow: `
		rgba(0, 0, 0, 0.9) 5px 5px 5px -15px, 
		rgba(255, 255, 255, 0.2) -7px -7px 16px -10px, 
		rgba(0, 0, 0, 4) 10px 10px 16px 0px
		`,
	//		rgba(0, 0, 0, 9) 5px 5px 6px`,

	// inset 5px 5px 5px -15px rgba(0,0,0,0.9),
	// inset -5px -5px 7px -15px rgba(255, 255, 255, 0.9),
	// 5px 5px 16px rgba(255,255,255,0.5),
	// 5px 5px 10px rgba(0, 0, 0, 0.4)
	// 	`,

	borderWidth: 0
};
const innerButtonBoxShadow = {
	boxShadow: `
	rgba(255, 255, 255, 0.1) -5px -5px 5px -1px inset, 
	rgba(0, 0, 0, 0.2) 5px 5px 5px -1px inset
	`
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		height: '100%',
		justifyContent: 'space-between'
	},
	row: {
		width: '100%',
		flexGrow: 1
	},
	buttonRow: {
		width: '100%',
		margin: 8,
		flexGrow: 1,
		flexBasis: '45%',
		maxHeight: '50%'
	},
	video: {
		width: '100%'
	},
	controlButton: {
		flexGrow: 1,
		flexBasis: 40,
		boxShadow: controlButtonBoxShadow
	},
	callButtonContainer: {
		height: '100%',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	callButtons: {
		flexGrow: 1,
		flexBasis: '40%',
		boxShadow: controlButtonBoxShadow,
		borderRadius: 10
	},
	callButtonLeft: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0
	},
	callButtonRight: {
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0
	},
	buttonGroup: {
		display: 'flex',
		flexDirection: 'row',
		margin: 0,
		padding: 0,
		height: '70%',
		width: '88%',
		borderRadius: 10,
		...buttonGroupBoxShadow,
		backgroundColor: 'white'
	},
	innerButtonGroup: {
		display: 'flex',
		// height: '100%',
		flexBasis: '30%',
		width: '100%',
		justifyContent: 'center',
		justifySelf: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		margin: 10,
		borderRadius: 10,
		...innerButtonBoxShadow
	},
	outerButtonGroup: {
		backgroundColor: 'inherit',
		// flexGrow: 1,
		// flexBasis: '40%',
		width: '95%',
		height: '95%',
		display: 'flex',
		justifyContent: 'center',
		justifySelf: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 4,
		padding: 15,
		...outerButtonGroupBoxShadow
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
export class Media extends React.Component {
	constructor(props) {
		super(props);
		this.state = { audioControl: null, audioControlsHidden: true };
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
	live() {
		this.props.audioRef.current.seekable.end();
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
					<Layout style={styles.outerButtonGroup}>
						<Layout style={styles.innerButtonGroup}>
							<ButtonGroup style={styles.buttonGroup}>
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
						<Layout style={[styles.innerButtonGroup, { flexBasis: '50%' }]}>
							<Layout style={[styles.callButtonContainer, { boxShadow: 'none' }]}>
								<Button
									style={[styles.callButtons, styles.callButtonLeft]}
									onPress={this.props.callFunctions.audio}
								>
									Audio Call
								</Button>
								<Button
									style={[styles.callButtons, styles.callButtonRight]}
									onPress={this.props.callFunctions.video}
								>
									Video Call
								</Button>
							</Layout>
						</Layout>
					</Layout>
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
