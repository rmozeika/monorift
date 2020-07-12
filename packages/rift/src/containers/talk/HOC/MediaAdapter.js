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

export default function withMediaAdapter(WrappedComponent) {
	class MediaAdapter extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				height: null,
				width: null
			};
		}
		play() {
			// this.props.startCallSaga('audio', {});
			this.props.play();
		}
		pause() {
			this.props.pause();
		}
		render() {
			const { props, play, pause, state } = this;
			const { height, width } = state;
			return <WrappedComponent play={play} pause={pause} {...props} />;
		}
	}
	const mapDispatchToProps = (dispatch, ownProps) => {
		return {
			play: (...args) => dispatch(Actions.playMedia(args)),
			pause: (...args) => dispatch(Actions.pauseMedia(args))
		};
	};
	const mapStateToProps = (state, ownProps) => {
		const { call } = state;
		return {
			// mediaStreamConstraints: constraints.mediaStream
		};
	};
	return connect(mapStateToProps, mapDispatchToProps)(MediaAdapter);
}
