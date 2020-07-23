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
		callById(id) {
			const { incomingCall } = this.props;
			const [call] = incomingCall.filter(({ call_id }) => call_id == id);
			const { users } = call;
			return users;
		}
		answer = id => {
			const { answer, incomingCall } = this.props;
			// const { from } = incomingCall;
			// answer(true, from);
			// CHANGE THIS
			// this.props.navigation.navigate('Talk');
			// const [call] = incomingCall.filter(({ call_id }) => call_id == id);
			// const { users } = call;
			const users = this.callById(id);
			answer(id, users, true);
		};
		reject = id => {
			const { answer, incomingCall } = this.props;
			// const { from } = incomingCall;

			// answer(false, from);
			// const [users] = incomingCall.filter(({ call_id }) => call_id == id);
			const users = this.callById(id);
			answer(id, users, false);
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
			incomingCall: CallSelectors.incomingConnectionsList(state)
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
