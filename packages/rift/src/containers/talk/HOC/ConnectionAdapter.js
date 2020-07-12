import * as React from 'react';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import { Dimensions } from 'react-native';
import { queuedUsers } from '@selectors/users';
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
			this.props.startCall({ type: 'audio', stream });
		}
		async getMediaFromFile(audioFileRef) {
			const dest = this.props.addSource(audioFileRef.current);
			var stream = dest.stream;
			audioFileRef.current.play();
			return stream;
		}
		call() {
			// this.props.startCallSaga('audio', {});
			this.props.startCall({ type: 'audio' });
		}
		videoCall() {
			// const { height, width } = this.state;
			// const dimensions = { height, width };
			const dimensions = this.getSize();
			this.props.startCall({ type: 'video', dimensions });
		}
		getSize = () => {
			const width = Dimensions.get('window').width;
			const height = Dimensions.get('window').height;
			const dimensions = { height, width };
			this.setState(dimensions);
			return dimensions;
		};
		render() {
			const { props, getSize, state } = this;
			const { height, width, queued } = state;
			return (
				<WrappedComponent
					getSize={getSize}
					videoHeight={height}
					videoWidth={width}
					startConnection={this.startConnection}
					queued={queued}
					// call={this.call}
					// videoCall={this.videoCall}
					{...props}
				/>
			);
		}
	}
	const mapDispatchToProps = (dispatch, ownProps) => {
		return {
			startCall: ({ type = 'audio', user = false, stream, dimensions }) =>
				dispatch(Actions.startCall({ type, user, stream, dimensions })),
			addSource: source => dispatch(Actions.addSource(source))
		};
	};
	const mapStateToProps = (state, ownProps) => {
		const queued = queuedUsers(state);
		return {
			queued
		};
	};
	return connect(mapStateToProps, mapDispatchToProps)(ConnectionAdapter);
}
