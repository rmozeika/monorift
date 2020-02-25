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
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';
import UserList from '../components/UsersList';
import Talk from './Talk';
import Users from './Users';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		flexDirection: 'column',
		alignItems: 'center',
		// overflow: 'scroll',
		maxWidth: 900,
		margin: 'auto',
		width: '100%',
		height: '100%'
	},
	row: {
		padding: 15,
		width: '100%'
	},
	tabContainer: {
		minHeight: 64,
		flexDirection: 'column',
		flexGrow: 1,
		height: '100%'
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
		// height: '100%'
	},
	column: {
		flexBasis: '50%',
		flexGrow: 1,
		height: '100%'
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
			setTopTabsIndex: 0,
			customHeights: {
				container: null,
				userList: null,
				callButton: null
			}
		};
		this.callContainerRef = React.createRef();
	}
	goToTalk() {
		console.log('Call talk func');
		this.setState({ topTabsIndex: 1 });
	}
	onLayout({ nativeEvent, timeStamp }) {
		const { mobile } = this.props;
		const { layout } = nativeEvent;
		const { width, height } = layout;
		if (!mobile) {
			this.setState({
				customHeights: {
					container: height,
					userList: height,
					callButton: 0
				}
			});
			return;
		}
		const heightWithoutTabBar = height - 32;
		const callButton = height * 0.1; // heightWithoutTabBar * 0.1;
		const userList = height - callButton;
		this.setState({
			customHeights: {
				container: height,
				userList,
				callButton
			}
		});
	}
	setTopTabsIndex(index) {
		console.log(index);
	}
	render() {
		const { customHeights } = this.state;
		const { tab, mobile } = this.props;
		const isMobile = window.innerWidth <= 500;
		if (!mobile) {
			return (
				<Layout style={styles.desktopLayout}>
					<Layout style={styles.column}>
						<Layout
							onLayout={this.onLayout.bind(this)}
							style={styles.desktopTabContainer}
						>
							<Users customHeights={customHeights} />
						</Layout>
					</Layout>
					<Layout style={styles.column}>
						<Layout style={styles.desktopTabContainer}>
							<Talk audioRef={this.audioRef} />
						</Layout>
					</Layout>
				</Layout>
			);
		}
		// const [bottomTabsIndex, setBottomTabsIndex] = React.useState(0);
		return (
			<Layout style={styles.container}>
				<TabView
					selectedIndex={tab}
					onSelect={this.setTopTabsIndex}
					style={{ width: '100%', flexGrow: 1 }}
				>
					<Tab title="Users">
						<Layout style={styles.tabContainer} onLayout={this.onLayout.bind(this)}>
							<Users customHeights={customHeights} />
						</Layout>
					</Tab>
					<Tab title="Talk">
						<Layout style={styles.tabContainer}>
							<Talk audioRef={this.audioRef} />
						</Layout>
					</Tab>
				</TabView>
			</Layout>
		);
	}
}

const CallContainerStyled = withStyles(CallContainer, theme => ({
	container: {
		backgroundColor: theme['color-primary-100']
	}
}));

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setViewTab: tab => dispatch(Actions.setTabView(tab))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { view } = state;
	const { tab, mobile } = view;
	return {
		tab,
		mobile
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CallContainerStyled);
