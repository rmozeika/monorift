import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { Layout, List, withStyles, Text, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as Selectors from '@selectors';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
import * as AuthSelectors from '@selectors/auth';
import { useWindowDimensions } from 'react-native';

export default function withConnectionAdapter(WrappedComponent) {
	class ConnectionAdapter extends React.Component {
		constructor(props) {
			super(props);
			this.startConnection = {
				audio: this.call.bind(this),
				video: this.videoCall.bind(this)
			};
			this.state = {
				height: null,
				width: null
			};
		}
		async fileCall() {
			const audioConstraints = { audio: true, video: false };
			this.setMediaStreamConstraints(true, false);
			const stream = await this.getMediaFromFile(audioConstraints);
			this.props.startCall(stream);
		}
		async getMediaFromFile(audioFileRef) {
			// const { audioFileRef } = this;
			const dest = this.props.addSource(audioFileRef.current);
			// source.connect(dest);
			var stream = dest.stream;
			audioFileRef.current.play();
			window.stream = stream; // make variable available to browser console
			return stream;
		}
		call() {
			// this.props.startCallSaga('audio', {});
			this.props.startCall({ type: 'audio' });
		}
		videoCall() {
			this.props.startCall({ type: 'video' });
		}
		getSize = () => {
			const width = useWindowDimensions().width;
			const height = useWindowDimensions().height;
			const dimensions = { height, width };
			this.setState(dimensions);
			return dimensions;
		};
		setMediaStreamConstraints(audio, video) {
			const { setConstraints } = this.props;
			mediaStreamConstraints = { audio, video };
			setConstraints({ mediaStream: mediaStreamConstraints });
		}
		render() {
			const { props, getSize, state } = this;
			const { height, width } = state;
			return (
				<WrappedComponent
					getSize={getSize}
					videoHeight={height}
					videoWidth={width}
					startConnection={this.startConnection}
					// call={this.call}
					// videoCall={this.videoCall}
					{...props}
				/>
			);
		}
	}
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
			mobile
			// tab
		};
	};
	return connect(mapStateToProps, mapDispatchToProps)(ConnectionAdapter);
}
