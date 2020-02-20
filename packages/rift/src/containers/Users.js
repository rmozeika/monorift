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

const styles = StyleSheet.create({
	userLayout: {
		width: '100%'
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
	}
	goTalk() {
		this.props.setViewTab(1);
	}
	render() {
		const {
			gotOnlineUsers,
			online,
			addToCall,
			removeFromCall,
			themedStyle
		} = this.props;
		const loading = (
			<Layout style={styles.row}>
				<Text>Loading...</Text>
			</Layout>
		);

		const toDisplay = () => {
			if (!gotOnlineUsers) {
				return loading;
			}
			return (
				<Layout style={styles.userLayout}>
					<UserList
						addToCall={addToCall}
						removeFromCall={removeFromCall}
						online={online}
					></UserList>
					<Layout style={[styles.buttonRow, themedStyle.buttonRow]}>
						<Button
							style={styles.button}
							// appearance="outline"
							onPress={this.goTalk.bind(this)}
						>
							To Call
						</Button>
					</Layout>
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
		getOnlineUsers: () => dispatch(Actions.getOnlineUsers())
	};
};
const mapStateToProps = (state, ownProps) => {
	const { users } = state;
	const { online } = users;
	const { gotOnlineUsers } = online;
	return {
		online: online.users,
		gotOnlineUsers
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(UsersStyled);
