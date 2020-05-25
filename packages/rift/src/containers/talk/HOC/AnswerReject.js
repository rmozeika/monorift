import * as React from 'react';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as CallSelectors from '@selectors/call';

// TODO: migrate away from this HOC
function withAnswerReject(WrappedComponent) {
	class AnswerRejectHOC extends React.Component {
		constructor(props) {
			super(props);
		}
		answer = id => {
			const { answer, incomingCall } = this.props;
			// const { from } = incomingCall;
			// answer(true, from);
			// CHANGE THIS
			// this.props.navigation.navigate('Talk');
			const user = incomingCall.find(conn => conn.id == id);
			answer(id, user, true);
		};
		reject = id => {
			const { answer, incomingCall } = this.props;
			// const { from } = incomingCall;

			// answer(false, from);
			const user = incomingCall.find(conn => conn.id == id);
			answer(user.id, user, true);
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
	const connected = connect(
		mapStateToProps,
		mapDispatchToProps
	)(AnswerRejectHOC);
	// return withStyles(connected, theme => ({
	//     callActions: {
	//         backgroundColor: theme['color-primary-500']
	//     }
	// }));
	return connected;
}

export default withAnswerReject;
