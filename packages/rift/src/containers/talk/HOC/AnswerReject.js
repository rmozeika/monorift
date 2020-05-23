import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { Layout, List, withStyles, Text, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as Selectors from '@selectors';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
import * as AuthSelectors from '@selectors/auth';

// TODO: migrate away from this HOC
export default function withAnswerReject(WrappedComponent) {
	class Base extends React.Component {
		constructor(props) {
			super(props);
		}
		answer = () => {
			const { answer, incomingCall } = this.props;
			const { from } = incomingCall;
			answer(true, from);
			// CHANGE THIS
			// this.props.navigation.navigate('Talk');
		};
		reject = () => {
			const { answer } = this.props;
			const { from } = incomingCall;

			answer(false, from);
		};
		render() {
			const { incomingCall, answer, ...restProps } = this.props;
			return (
				<WrappedComponent
					incomingCall={incomingCall}
					answer={this.answer}
					reject={this.reject}
					{...restProps}
				/>
			);
		}
	}
	const mapStateToProps = (state, ownProps) => {
		return {
			incomingCall: CallSelectors.incomingCall(state)
		};
	};
	const mapDispatchToProps = (dispatch, ownProps) => {
		return {
			answer: (answered, from) => dispatch(Actions.answer(answered, from))
		};
	};
	const connected = connect(mapStateToProps, mapDispatchToProps)(Base);
	// return withStyles(connected, theme => ({
	//     callActions: {
	//         backgroundColor: theme['color-primary-500']
	//     }
	// }));
	return connected;
}
