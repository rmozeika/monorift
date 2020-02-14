import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles,
	TabView,
	Tab
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
		overflow: 'scroll',
		maxWidth: 900,
		margin: 'auto',
		width: '100%'
	},
	row: {
		padding: 15,
		width: '100%'
	},
	tabContainer: {
		minHeight: 64
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
		this.state = {
			topTabsIndex: 0,
			setTopTabsIndex: 0
		};
	}
	goToTalk() {
		console.log('Call talk func');
		debugger;
		this.setState({ topTabsIndex: 1 });
	}
	render() {
		const { topTabsIndex, setTopTabsIndex } = this.state;
		// const [bottomTabsIndex, setBottomTabsIndex] = React.useState(0);
		return (
			<Layout style={styles.container}>
				<TabView
					selectedIndex={topTabsIndex}
					onSelect={setTopTabsIndex}
					style={{ width: '100%' }}
				>
					<Tab title="users">
						<Layout style={styles.tabContainer}>
							<Users goToTalk={this.goToTalk.bind(this)} />
						</Layout>
					</Tab>
					<Tab title="talk">
						<Layout style={styles.tabContainer}>
							<Talk audioRef={this.audioRef} />
						</Layout>
					</Tab>
				</TabView>
			</Layout>
		);
	}
}

export default withStyles(CallContainer, theme => ({
	container: {
		backgroundColor: theme['color-primary-100']
	}
}));
