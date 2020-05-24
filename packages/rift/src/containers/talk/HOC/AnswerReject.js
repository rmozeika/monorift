import * as React from 'react';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as CallSelectors from '@selectors/call';

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
			incomingCall: CallSelectors.incomingConnections(state)
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
