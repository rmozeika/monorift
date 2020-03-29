import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { Layout, List, withStyles, Text, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as Selectors from '@selectors';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
import * as AuthSelectors from '@selectors/auth';

import UserItem from './UserItem';
import YourProfile from './YourProfile';
import SearchBar from '@components/users/SearchBar';
import EmptyFriendsPrompt from '@components/users/EmptyFriendsPrompt';
import CallActions from '@components/buttons/CallActions';
import UpdateTempUsername from '@components/users/UpdateTempUsername';

class UsersList extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	goToUsers = () => {
		this.props.navigation.navigate('Users');
	};
	answer = () => {
		const { answer } = this.props;
		answer(true);
		this.props.navigation.navigate('Talk');
	};
	reject = () => {
		const { answer } = this.props;
		answer(false);
	};
	_keyExtractor = item => {
		return item;
	};
	renderItem = ({ item: user, index, ...restProps }) => {
		// IF REACTIVATE PROFILE
		// if (user == 'self') {
		// 	return (<YourProfile themedStyle={this.props.themedStyle.userItem} />);
		// }
		return (
			<UserItem themedStyle={this.props.themedStyle.userItem} username={user} />
		);
	};

	render() {
		const {
			incomingCall,
			users,
			listType,
			loggedIn,
			checked,
			themedStyle
		} = this.props;

		const emptyFriends = users.length == 0;
		if (listType == 'friends' && emptyFriends) {
			return (
				<EmptyFriendsPrompt
					loggedIn={loggedIn}
					checked={checked}
					goToUsers={this.goToUsers}
				/>
			);
		}
		return (
			<Layout style={[styles.userListLayout, {}]}>
				<SearchBar />
				<List
					data={users}
					renderItem={this.renderItem}
					style={styles.list}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContentContainer}
					// numColumns={2}
					// columnWrapperStyle={styles.columnWrapper}
					initialNumToRender={8}
					keyExtractor={this._keyExtractor}
				/>
				{/* <Layout style={styles.floatingButtonContainer}>
					<Button style={{}}>Call</Button>
				</Layout> */}
				<CallActions
					themedStyle={themedStyle.callActions}
					incomingCall={incomingCall}
					answer={this.answer}
					reject={this.reject}
				/>
			</Layout>
		);
	}
}

export const UsersListWithStyles = withStyles(UsersList, theme => ({
	buttonGroup: {
		backgroundColor: theme['color-primary-100'],
		marginHorizontal: 0
	},
	callActions: {
		backgroundColor: theme['color-primary-500']
	},
	userItem: {
		onlineColor: theme['color-success-500'],
		statusBar: {
			backgroundcolor: theme['color-basic-transparent-disabled-border']
		},
		statusText: {
			color: theme['color-success-500'] // CHANGE THIS!
		},
		iconOnline: {
			backgroundColor: theme['color-primary-100'],
			// color: theme['color-basic-800']
			color: theme['color-success-500']
		}
	},

	container: { backgroundColor: '#1A2138' }
}));

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	userListLayout: {
		width: '100%',
		// overflowY: 'scroll',
		// height: '80vh',
		height: '100%'
	},
	row: {
		padding: 15,
		width: '100%',
		alignItems: 'center'
	},
	userBlock: {
		flex: 1,
		flexBasis: 50,
		flexDirection: 'row',
		borderRadius: 10,
		borderStyle: 'solid',
		borderWidth: 0.5,
		borderColor: '#4C3C1B',
		margin: 1,
		padding: 15,
		height: 'auto',
		width: 'auto',
		flexShrink: 1
	},
	column: {
		padding: 15,
		height: 'auto',
		width: 'auto',
		flexBasis: 'auto',
		flexShrink: 0,
		flexGrow: 1
	},
	button: {
		flex: 1
	},
	list: {
		width: '100%'
	},
	listContentContainer: {
		// flexShrink: 1,
		// flexDirection: 'row',
		// flexWrap: 'wrap',
		order: -1,
		justifyContent: 'space-between'
	},
	columnWrapper: {
		flexBasis: 150,
		flexGrow: 1,
		flexShrink: 1,
		marginVertical: 4
	},
	floatingButtonContainer: {
		position: 'fixed',
		right: '10%',
		bottom: '10%'
	}
});

const mapDispatchToProps = dispatch => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab)),
		answer: answered => dispatch(Actions.answer(answered))
	};
};

const mapStateToProps = (state, props) => {
	const { view, auth } = state;
	const { listType } = props.route.params;
	const { tab, mobile } = view;
	const { loggedIn, checked } = auth;
	// const listType = route.initialParams.listType;
	// const visibleUsers = UserSelectors.getVisibleUserlist(state, props); //props);
	// const visibleUsers = UserSelectors.getUserMasterlist(state); //props);
	const visibleUsers = UserSelectors.getVisibleUserlistSearch(state, props);

	return {
		tab,
		mobile,
		incomingCall: CallSelectors.incomingCall(state),
		users: visibleUsers,
		loggedIn,
		checked,
		listType
		// IF REACTIVATE PROFILE
		// self: AuthSelectors.getSelfUser(state)
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListWithStyles);
