import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';
import UserList from '../components/UsersList';
import CallActions from '../components/buttons/CallActions';

const styles = StyleSheet.create({
	userLayout: {
		width: '100%',
		height: '100%'
	},
	loadingContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	container: {
		flex: 1,
		alignItems: 'center',
		display: 'flex',
		width: '100%'
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
		this.props.fetchOnlineUsers();
		// this.props.fetchFriends();

		this.goTalk = this.goTalk.bind(this);
		this.answer = this.answer.bind(this);
		this.reject = this.reject.bind(this);
		this.onLayout = this.onLayout.bind(this);
	}
	goTalk() {
		this.props.setViewTab(1);
	}
	onLayout({ nativeEvent, timeStamp }) {
		const { mobile, incomingCall } = this.props;
		const { layout } = nativeEvent;
		const { width, height } = layout;
		// if (!mobile) {
		// 	this.setState({
		// 		containerHeight: {
		// 			container: height,
		// 			userList: height,
		// 			callButton: 0
		// 		}
		// 	});
		// 	return;
		// }
		// const actionHeightMultiplier = incomingCall.received ? 0.15 : 0.1;
		// const callActions = height * actionHeightMultiplier;
		this.setState({
			containerHeight: height
		});
	}
	answer() {
		const { answer } = this.props;
		answer(true);
	}
	reject() {
		const { answer } = this.props;
		answer(false);
	}
	calculateHeights() {
		const { containerHeight, mobile, incomingCall } = this.props;
		const callActions = containerHeight * actionHeightMultiplier;
		const userList = containerHeight - callActions;
		return { userList, callActions };
	}
	render() {
		const {
			gotOnlineUsers,
			online,
			themedStyle,
			mobile,
			incomingCall
		} = this.props;
		const { containerHeight } = this.state;
		// const heights = this.calculateHeights();
		// const loading = (
		// 	<Layout style={styles.row}>
		// 		<Text>Loading...</Text>
		// 	</Layout>
		// );
		if (containerHeight == null) {
			return (
				<Layout
					onLayout={this.onLayout}
					style={[styles.userLayout, styles.loadingContainer]}
				>
					<Text>Loading</Text>
				</Layout>
			);
		}
		if (!gotOnlineUsers) {
			return (
				<Layout
					onLayout={this.onLayout}
					style={[styles.userLayout, styles.loadingContainer]}
				>
					<Text>Loading</Text>
				</Layout>
			);
		}
		// const toDisplay = () => {
		// 	debugger;
		// 	return (
		// 		<Layout style={styles.userLayout}>
		// 			<UserList online={online} baseHeight={containerHeight} ></UserList>
		// 			<CallActions
		// 				onPress={this.goTalk}
		// 				themedStyle={themedStyle.buttonRow}
		// 				incomingCall={incomingCall}
		// 				answer={this.answer}
		// 				reject={this.reject}
		// 				baseHeight={containerHeight}
		// 			/>
		// 		</Layout>
		// 	);
		// };
		return (
			<Layout style={styles.container}>
				<Layout style={styles.userLayout}>
					<UserList online={online} baseHeight={containerHeight}></UserList>
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
		setViewTab: tab => dispatch(Actions.setTabView(tab)),
		fetchOnlineUsers: () => dispatch(Actions.fetchOnlineUsers()),
		answer: answered => dispatch(Actions.answer(answered)),
		fetchFriends: () => dispatch(Actions.fetchFriends())
	};
};
const mapStateToProps = (state, ownProps) => {
	const { users, view, call } = state;
	const { online } = users;
	const { gotOnlineUsers } = online;
	const { mobile } = view;

	const { incomingCall } = call.peerStore;

	return {
		online: online.users,
		gotOnlineUsers,
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
