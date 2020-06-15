import * as React from 'react';
import { StyleSheet } from 'react-native';
import { List } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as UserSelectors from '@selectors/users';
import * as GroupSelectors from '@selectors/groups';

import EmptyFriendsPrompt from '@components/users/EmptyFriendsPrompt';
import UserItem from './UserItem.native';
// import YourProfile from './YourProfile';
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
		const { incomingCall, users, listType, loggedIn, checked } = this.props;

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
		);
	}
}

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
	const { tab, mobile } = view;
	const { loggedIn, checked } = auth;
	// const listType = route.initialParams.listType;

	const { listType, group } = props.route.params;

	let visibleUsers;

	if (!group) {
		visibleUsers = UserSelectors.filteredUsersByOnline(state, props);
	} else {
		visibleUsers = GroupSelectors.filteredMembers(state, props);
	}
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
export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
