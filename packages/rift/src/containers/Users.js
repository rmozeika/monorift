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
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center',
		display: 'flex',
		width: '100%'
	},
	row: {
		padding: 15,
		width: '100%'
	},
	button: {
		// margin: 8,
		margin: 15,
		width: '100%',
		height: '100%',
		margin: 0
	},
	buttonRow: {
		display: 'flex',
		alignItems: 'center',
		jusatifyContent: 'center',
		margin: 0,
		height: '10vh'
	}
});
// let peerStore;

// let connName2 = 'conn2';
// let audioRef = React.createRef();
// let videoRef = React.createRef();
// let selfRef = React.createRef();

class Users extends React.Component {
	constructor(props) {
		super(props);
		this.props.getOnlineUsers();
		this.goTalk = this.goTalk.bind(this);
		this.answer = this.answer.bind(this);
		this.reject = this.reject.bind(this);
	}
	goTalk() {
		this.props.setViewTab(1);
	}
	answer() {
		debugger;
		const { answer } = this.props;
		answer(true);
	}
	reject() {
		const { answer } = this.props;
		answer(false);
	}
	render() {
		const {
			gotOnlineUsers,
			online,
			themedStyle,
			customHeights,
			mobile,
			incomingCall
		} = this.props;
		const loading = (
			<Layout style={styles.row}>
				<Text>Loading...</Text>
			</Layout>
		);
		if (customHeights.callButton == null) {
			return (
				<Layout style={[styles.userLayout, styles.loadingContainer]}>
					<Text>Loading</Text>
				</Layout>
			);
		}
		const toDisplay = () => {
			if (!gotOnlineUsers) {
				return loading;
			}
			return (
				<Layout style={styles.userLayout}>
					<UserList online={online} customHeight={customHeights.userList}></UserList>
					{/* <Layout style={[styles.buttonRow, themedStyle.buttonRow, { height: customHeights.callButton }]}>
						<Button
							style={styles.button}
							// appearance="outline"
							onPress={this.goTalk.bind(this)}
						>
							To Call
						</Button>
					</Layout> */}
					{/* {mobile && ( */}
					<CallActions
						style={[
							styles.buttonRow,
							themedStyle.buttonRow,
							{ height: customHeights.callButton }
						]}
						onPress={this.goTalk}
						buttonHeight={customHeights.callButton}
						themedStyle={themedStyle.buttonRow}
						callIncoming={incomingCall.received}
						userCalling={incomingCall.from}
						answer={this.answer}
						reject={this.reject}
					/>
					{/* )} */}
				</Layout>
			);
		};
		return <Layout style={styles.container}>{toDisplay()}</Layout>;
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
		getOnlineUsers: () => dispatch(Actions.getOnlineUsers()),
		answer: answered => dispatch(Actions.answer(answered))
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
export default connect(mapStateToProps, mapDispatchToProps)(UsersStyled);
