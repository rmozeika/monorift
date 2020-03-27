import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles,
	TabView,
	Tab
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import * as Actions from '@actions';
import UserList from './UsersList';
import Talk from '../talk/Talk';
import Users from './Users';
import TabBar from '@components/users/TabBar';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		// maxWidth: 900,
		margin: 0, // 'auto',
		width: '100%',
		height: '100%',
		alignItems: 'flex-start'
	},
	row: {
		padding: 15,
		width: '100%'
	},
	tabContainer: {
		minHeight: 64,
		flexDirection: 'row',
		flexGrow: 1
	},
	desktopTabContainer: {
		minHeight: 64,
		flexDirection: 'column',
		height: '100%'
	},
	desktopLayout: {
		display: 'flex',
		flexDirection: 'row',
		flexGrow: 1
	},
	column: {
		flexBasis: '50%',
		flexGrow: 1,
		height: '100%'
	},
	tabView: {
		display: 'flex',
		// width: '100%',
		flexBasis: '50%',
		flexGrow: 1
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

class UserScreen extends React.Component {
	constructor(props) {
		super(props);
		this.audioRef = React.createRef();
		this.state = {
			topTabsIndex: 0,
			setTopTabsIndex: 0,
			containerHeight: null
		};
		this.UserScreenRef = React.createRef();
		this.setTopTabsIndex = this.setTopTabsIndex.bind(this);
	}
	goToTalk() {
		this.setState({ topTabsIndex: 1 });
	}
	onLayout({ nativeEvent, timeStamp }) {
		const { mobile } = this.props;
		const { layout } = nativeEvent;
		const { width, height } = layout;
		if (!mobile) {
			this.setState({
				containerHeight: {
					container: height,
					userList: height,
					callButton: 0
				}
			});
			return;
		}
		this.setState({
			containerHeight: height
		});
	}
	getDisplayStyle() {
		const { mobile, tab, loggedIn } = this.props;
		const getVal = () => {
			if (!mobile) return { users: 'flex', talk: 'flex' };
			const totalTabs = loggedIn ? 2 : 1; // -1
			if (totalTabs > tab) return { users: 'flex', talk: 'none' };
			return { users: 'none', talk: 'flex' };
		};
		const { users, talk } = getVal();

		return {
			users: { display: users }, //Display },
			talk: { display: talk } // isplay }
		};
	}
	setTopTabsIndex(index) {
		console.log(index);
		this.props.setTabView(index);
	}
	render() {
		const { containerHeight } = this.state;
		const { tab, mobile, loggedIn, checked } = this.props;
		const displayStyles = this.getDisplayStyle();
		if (!checked) {
			return (
				<Layout style={styles.loadingContainer}>
					<Text>Loading</Text>
				</Layout>
			);
		}
		return (
			<Layout style={styles.container}>
				<TabBar
					mobile={mobile}
					loggedIn={loggedIn}
					tab={tab}
					setTopTabsIndex={this.setTopTabsIndex}
					style={{ backgroundColor: '#1A2237' }}
				/>
				<Layout style={[styles.tabContainer, { width: '100%' }]}>
					<Layout style={[styles.tabView, displayStyles.users]}>
						<Users />
					</Layout>
					<Layout style={[styles.tabView, displayStyles.talk]}>
						<Talk audioRef={this.audioRef} />
					</Layout>
				</Layout>
			</Layout>
		);
	}
}

const UserScreenStyled = withStyles(UserScreen, theme => ({
	container: {
		backgroundColor: theme['color-primary-100']
	}
}));

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { view, auth } = state;
	const { tab, mobile } = view;
	const { loggedIn, checked } = auth;
	return {
		tab,
		mobile,
		loggedIn,
		checked
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreenStyled);
