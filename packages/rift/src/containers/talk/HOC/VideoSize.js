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

export default function withVideoSize(WrappedComponent) {
	class VideoSize extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				height: null,
				width: null
			};
		}
		getSize = () => {
			const width = useWindowDimensions().width;
			const height = useWindowDimensions().height;
			const dimensions = { height, width };
			this.setState(dimensions);
			return dimensions;
		};
		render() {
			const { props, getSize, state } = this;
			const { height, width } = state;
			return (
				<WrappedComponent
					getSize={getSize}
					videoHeight={height}
					videoWidth={width}
					{...props}
				/>
			);
		}
	}
	return VideoSize;
}
