import * as React from 'react';
import { Layout, Text, Button, withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import * as Actions from '@actions';
import Media from './Media';
import CallActions from '@components/buttons/CallActions';
import StreamAudioFile from '@components/talk/StreamAudioFile';

let mediaStreamConstraints = {
	audio: true,
	video: false
};

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

		this.fileCall = this.fileCall.bind(this);
		this.callFunctions = {
			audio: this.call.bind(this),
			video: this.videoCall.bind(this)
		};
		// this.getDisplayStyle = this.get
	}
	setMediaStreamConstraints(audio, video) {
		const { setConstraints } = this.props;
		mediaStreamConstraints = { audio, video };
		setConstraints({ mediaStream: mediaStreamConstraints });
	}
	async getMediaFromFile() {
		const { audioFileRef } = this;
		const dest = this.props.addSource(audioFileRef.current);
		// source.connect(dest);
		var stream = dest.stream;
		audioFileRef.current.play();
		window.stream = stream; // make variable available to browser console
		return stream;
	}
	async fileCall() {
		const audioConstraints = { audio: true, video: false };
		this.setMediaStreamConstraints(true, false);
		const stream = await this.getMediaFromFile(audioConstraints);
		this.props.startCall(stream);
	}
	call() {
		// this.props.startCallSaga('audio', {});
		this.props.startCall({ type: 'audio' });
	}
	videoCall() {
		this.props.startCall({ type: 'video' });
	}
	render() {
		const loading = (
			<Layout style={styles.row}>
				<Text>Loading...</Text>
			</Layout>
		);

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
							callFunctions={this.callFunctions}
							videoRef={this.videoRef}
							audioRef={this.audioRef}
						/>
					</Layout>
					{/* <StreamAudioFile fileCall={this.fileCall} audioFileRef={this.audioFileRef} /> */}
					<CallActions />
				</Layout>
			</ScrollView>
		);
	}
}
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

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		// sendOffer: message => dispatch(Actions.sendOffer(message)),
		setConstraints: ({ mediaStream }) =>
			dispatch(Actions.setConstraints({ mediaStream })),
		// setStream: stream => dispatch(Actions.setStream(stream)),
		// startCallSaga: type => dispatch(Actions.startCall(type)),
		startCall: ({ type = 'audio', user = false, stream }) =>
			dispatch(Actions.startCall(type, user, stream)),
		addSource: source => dispatch(Actions.addSource(source))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { call, view } = state;
	const { mobile, tab } = view;
	const { constraints } = call;
	return {
		mediaStreamConstraints: constraints.mediaStream,
		mobile,
		tab
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Adapter);
