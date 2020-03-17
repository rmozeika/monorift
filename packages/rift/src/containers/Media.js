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
const outerButtonGroupBoxShadow = {
	boxShadow: `
			inset 5px 5px 5px -15px rgba(0,0,0,0.1), 
			inset -5px -5px 7px -15px rgba(255, 255, 255, 0.4), 
			5px 5px 16px rgba(255,255,255,0.5), 
			5px 5px 10px rgba(0, 0, 0, 0.4)
		`
};
const workspace = `inset 10px 10px 10px rgba(0,0,0,.1), inset -10px -10px 5px rgba(0,0,0,.1), inset -10px 10px 5px rgba(0,0,0,.1), inset 10px -10px 10px rgba(0,0,0,.1)`;
const buttonGroupBoxShadow = {
	boxShadow:
		// `
		// rgba(0, 0, 0, 0.9) 5px 5px 5px -15px inset,
		// rgba(0,0,0, 0.9) -5px -5px 7px -15px inset,
		// rgba(0,0,0, 0.3) 5px 5px 16px,
		// rgba(0, 0, 0, 0.4) 5px 5px 6px
		// `,
		`rgba(0, 0, 0, 0.9) 5px 5px 5px -15px, 
	rgba(0, 0, 0, 0.9) -5px -6px 7px -14px, 
	rgba(0, 0, 0, 4) 5px 5px 16px, 
	rgba(0, 0, 0, 9) 5px 5px 6px`,
	//  `
	// inset 5px 5px 5px -15px rgba(0,0,0,0.9),
	// inset -5px -5px 7px -15px rgba(255, 255, 255, 0.9),
	// 5px 5px 16px rgba(255,255,255,0.5),
	// 5px 5px 10px rgba(0, 0, 0, 0.4)
	// 	`,

	borderWidth: 0
};
const innerButtonBoxShadow = {
	boxShadow: `
	inset 5px 5px 5px -1px rgba(255,255,255,0.1), 
	inset -5px -5px 5px -1px rgba(0, 0, 0, 0.2),
	rgba(0,0, 0, 0.3) 5px 5px 5px -1px, rgba(0, 0, 0, 0.2) -5px -5px 5px -1px, rgba(0,0, 0, 0.3) -5px 5px 5px -1px, rgba(0, 0, 0, 0.2) 5px -5px 5px 2px
	`
};
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
		flexBasis: 40,
		boxShadow: workspace
	},
	buttonGroup: {
		display: 'flex',
		flexDirection: 'row',
		// width: '90%',
		// margin: 'auto',
		// boxShadow: `inset 4px 4px 6px -1px #2c58db, inset -4px -4px 6px -1px #3a74ff`,
		// boxShadow: `inset 4px 4px 6px -1px rgb(0, 0, 0, .5), inset -4px -4px 6px -1px rgb(255, 255, 255, .5)`,
		// boxShadow: `26px 26px 53px #2b56d6,
		// -26px -26px 53px #3b76ff`,
		boxShadow: `
			inset 5px 5px 5px -15px #2851c9, 
			inset -5px -5px 7px -15px #3e7bff, 
			5px 5px 4px #2851c9, 
			5px 5px 10px #3e7bff
		`,
		margin: 0,
		padding: 0,
		height: '70%',
		width: '88%',
		borderRadius: 4,
		...buttonGroupBoxShadow,
		backgroundColor: 'white'
	},
	innerButtonGroup: {
		display: 'flex',
		height: '100%',
		width: '100%',
		justifyContent: 'center',
		justifySelf: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		// margin: 10,
		...innerButtonBoxShadow
	},
	outerButtonGroup: {
		// boxShadow: `30px 30px 30px -10px #2c58db, -30px -30px 30px -10px #3a74ff, -0.5px -0.5px 0 #2c58db, 0.5px 0.5px 0 rgba(0,0,0,0.02)`,
		// backgroundColor: 'rgb(51, 102, 255)',
		backgroundColor: 'inherit',
		height: 200,
		width: 500,
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
