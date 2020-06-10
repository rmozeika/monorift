import * as React from 'react';
import { StyleSheet, Linking, Platform, FlatList } from 'react-native';
import { Layout, List, withStyles, Text, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as Selectors from '@selectors';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
import * as AuthSelectors from '@selectors/auth';

import UserItem from './UserItem.native';
// import YourProfile from './YourProfile';
import SearchBar from '@components/users/SearchBar';
import EmptyFriendsPrompt from '@components/users/EmptyFriendsPrompt';
import CallActions from '@components/buttons/CallActions';
import UpdateTempUsername from '@components/users/UpdateTempUsername';
const ITEM_HEIGHT = 90;
class UsersList extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	goToUsers = () => {
		this.props.navigation.navigate('Users');
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
			// <Layout style={styles.itemContainer}>
			<UserItem key={user} id={user} />
			// </Layout>
		);
	};
	getItemLayout(data, index) {
		return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
	}
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
				<Layout style={[styles.userListLayout, {}]}>
					<EmptyFriendsPrompt
						loggedIn={loggedIn}
						checked={checked}
						goToUsers={this.goToUsers}
					/>
					<CallActions themedStyle={styles.callActions} />
				</Layout>
			);
		}
		return (
			<Layout style={styles.userListLayout}>
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
					getItemLayout={this.getItemLayout}
				/>
				<CallActions themedStyle={styles.callActions} />
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
		backgroundColor: theme['color-primary-500'],
		position: 'absolute',
		width: '100%',
		bottom: 0
	},
	// only used in native
	itemContainer: {
		height: 90
	},
	container: { backgroundColor: '#1A2138' }
}));

const styles = StyleSheet.create({
	list: {
		width: '100%',
		backgroundColor: '#101426'
	},
	userListLayout: {
		width: '100%',
		height: '100%',
		backgroundColor: '#101426'
	},
	listContentContainer: {
		// flexShrink: 1,
		// flexDirection: 'row',
		// flexWrap: 'wrap',
		justifyContent: 'space-between',
		backgroundColor: '#101426'
	},

	// unused (unless multi column enabled)
	column: {
		padding: 15,
		height: 'auto',
		width: 'auto',
		flexBasis: 'auto',
		flexShrink: 0,
		flexGrow: 1
	},
	columnWrapper: {
		flexBasis: 150,
		flexGrow: 1,
		flexShrink: 1,
		marginVertical: 4
	}
});

const mapDispatchToProps = dispatch => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab))
	};
};

const mapStateToProps = (state, props) => {
	const { view, auth } = state;
	const { listType } = props.route.params;
	const { tab, mobile } = view;
	const { loggedIn, checked } = auth;
	// const listType = route.initialParams.listType;

	const visibleUsers = UserSelectors.filteredUsersByOnline(state, props);
	// const visibleUsers = UserSelectors.getUsersByOnlineCached(state, props);
	return {
		tab,
		mobile,
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
