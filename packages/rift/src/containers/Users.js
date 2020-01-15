import * as React from 'react';
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';
import UserList from '../components/UsersList';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center'
	},
	row: {
		padding: 15,
		width: '100%'
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
	}
	componentDidMount() {
		this.props.getOnlineUsers();
	}
	componentDidUpdate() {}
	render() {
		const { gotOnlineUsers, online } = this.props;
		const loading = (
			<Layout style={styles.row}>
				<Text>Loading...</Text>
			</Layout>
		);
		const toDisplay = () => {
			if (!gotOnlineUsers) {
				return loading;
			}
			return <UserList online={online}></UserList>;
		};
		return <Layout style={styles.container}>{toDisplay()}</Layout>;
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
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
export default connect(mapStateToProps, mapDispatchToProps)(Users);
