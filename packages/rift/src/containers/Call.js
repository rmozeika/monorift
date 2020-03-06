import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles,
	TabView,
	Tab,
	TabBar
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import * as rtcUtils from '../core/utils/rtc';
import * as Actions from '../actions';
import UserList from './UsersList';
import Talk from './Talk';
import Users from './Users';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
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
	},
	column: {
		flexBasis: '50%',
		flexGrow: 1,
		height: '100%'
	}
});

class CallContainer extends React.Component {
	constructor(props) {
		super(props);
		this.audioRef = React.createRef();
		this.state = {
			topTabsIndex: 0,
			setTopTabsIndex: 0,
			containerHeight: null
		};
		this.callContainerRef = React.createRef();
		this.setTopTabsIndex = this.setTopTabsIndex.bind(this);
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
	setTopTabsIndex(index) {
		console.log(index);
		this.props.setTabView(index);
	}
	render() {
		const { containerHeight } = this.state;
		const { tab, mobile } = this.props;
		const isMobile = window.innerWidth <= 500;
		if (!mobile) {
			return (
				<Layout style={styles.desktopLayout}>
					<Layout style={styles.column}>
						<Layout style={styles.desktopTabContainer}>
							<Users />
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

		if (true == false) {
			return (
				<Layout style={styles.container}>
					<TabBar
						selectedIndex={tab}
						onSelect={this.setTopTabsIndex}
						style={{ width: '100vw', flexGrow: 1 }}
					>
						<Tab title="Friends" />
						<Tab title="Users" />
						<Tab title="Talk" />
					</TabBar>
					<Layout style={[styles.tabContainer, { width: '100%' }]}>
						<Users friendList={true} containerHeight={containerHeight} />
					</Layout>
				</Layout>
			);
		}
		return (
			<Layout style={styles.container}>
				<TabView
					selectedIndex={tab}
					onSelect={this.setTopTabsIndex}
					style={{ width: '100%', flexGrow: 1 }}
				>
					<Tab title="Friends">
						<Layout style={styles.tabContainer}>
							<Users friendList={true} containerHeight={containerHeight} />
						</Layout>
					</Tab>
					<Tab title="Users">
						<Layout style={styles.tabContainer}>
							<Users containerHeight={containerHeight} />
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
		setTabView: tab => dispatch(Actions.setTabView(tab))
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
