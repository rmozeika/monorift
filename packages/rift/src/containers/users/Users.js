import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as Actions from '@actions';
import UsersList from './UsersList';

import CallActions from '@components/buttons/CallActions';

const styles = StyleSheet.create({
	userLayout: {
		width: '100%',
		height: '100%'
	},
	loadingContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		flexBasis: '50%',
		flexGrow: 1
	},
	container: {
		flex: 1,
		alignItems: 'center',
		display: 'flex',
		width: '100%'
		// flexBasis: '50%' // CHANGE THIS FULL VIEW
	},
	row: {
		padding: 15,
		width: '100%'
	},
	button: {
		margin: 15,
		width: '100%',
		height: '100%',
		margin: 0
	},
	buttonRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 0,
		height: '10vh'
	}
});

class Users extends React.Component {
	constructor(props) {
		super(props);
		this.state = { containerHeight: null };
	}

	answer = () => {
		const { answer } = this.props;
		answer(true);
	};
	reject = () => {
		const { answer } = this.props;
		answer(false);
	};

	render() {
		const { gotUsers, themedStyle, mobile, incomingCall } = this.props;
		const { containerHeight } = this.state;

		if (containerHeight == null) {
			return (
				<Layout onLayout={this.onLayout} style={styles.loadingContainer}>
					<Text>Loading</Text>
				</Layout>
			);
		}
		if (!gotUsers) {
			return (
				<Layout
					onLayout={this.onLayout}
					style={[styles.userLayout, styles.loadingContainer]}
				>
					<Text>Loading</Text>
				</Layout>
			);
		}

		return (
			<Layout style={styles.container}>
				<Layout style={styles.userLayout}>
					<UsersList baseHeight={containerHeight}></UsersList>
					<CallActions
						onPress={this.goTalk}
						themedStyle={themedStyle.buttonRow}
						incomingCall={incomingCall}
						answer={this.answer}
						reject={this.reject}
						baseHeight={containerHeight}
					/>
				</Layout>
			</Layout>
		);
	}
}
const UsersStyled = withStyles(Users, theme => ({
	buttonRow: {
		backgroundColor: theme['color-primary-500']
	}
}));

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab)),
		answer: answered => dispatch(Actions.answer(answered))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { users, view, call } = state;
	// const { online } = users;
	const { gotUsers } = users.status;
	const { mobile } = view;

	const { incomingCall } = call.peerStore;

	return {
		// online: online.users,
		gotUsers,
		mobile,
		incomingCall
	};
};
function mergeProps(stateProps, dispatchProps, ownProps) {
	return { ...ownProps, ...stateProps, ...dispatchProps };
}
export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(UsersStyled);
