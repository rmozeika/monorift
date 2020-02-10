import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles,
	TabView
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';
import UserList from '../components/UsersList';
import Talk from './Talk';
import Users from './Users';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center',
		overflow: 'scroll'
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

class CallContainer extends React.Component {
	constructor(props) {
		super(props);
		this.audioRef = React.createRef();
	}
	render() {
		return (
			<Layout style={[styles.container, styles.container]}>
				<Users />
				<Talk audioRef={this.audioRef} />
			</Layout>
		);
	}
}

export default withStyles(CallContainer, theme => ({
	container: {
		backgroundColor: theme['color-primary-100']
	}
}));
