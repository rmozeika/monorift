import React, { memo } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Layout, withStyles } from '@ui-kitten/components';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import * as Selectors from '@selectors';
import * as CallSelectors from '@selectors/call';
import * as UserSelectors from '@selectors/users';
import * as AuthSelectors from '@selectors/auth';

import UserItem from './UserItem.web';
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

	_keyExtractor = item => {
		return item;
	};
	renderItem = memo(({ data, index, style, isScrolling, ...restProps }) => {
		const user = data[index];
		// IF REACTIVATE PROFILE
		// if (user == 'self') {
		// 	return (<YourProfile themedStyle={this.props.themedStyle.userItem} />);
		// }
		return (
			<Layout style={style} level="4">
				<UserItem key={user} id={user} isScrolling={isScrolling} />
				{/* {isScrolling ? 'Scrolling' : <UserItem key={user} themedStyle={this.props.themedStyle.userItem} id={user} />} */}
			</Layout>
		);
	});
	itemKey(index, data) {
		const key = data[index];
		return key;
	}
	render() {
		const { incomingCall, users, listType, loggedIn, checked, eva } = this.props;
		const { style } = eva;

		const emptyFriends = users.length == 0;
		if (listType == 'friends' && emptyFriends) {
			return (
				<Layout style={[styles.userListLayout, {}]}>
					<EmptyFriendsPrompt
						loggedIn={loggedIn}
						checked={checked}
						goToUsers={this.goToUsers}
					/>
					<CallActions themedStyle={style.callActions} />
				</Layout>
			);
		}
		// const height = 1000;
		const itemHeight = 90;
		// const width = 400;
		return (
			<Layout style={[styles.userListLayout, {}]}>
				<SearchBar />
				<AutoSizer>
					{({ height, width }) => {
						return (
							<List
								itemData={users}
								height={height - 54}
								width={width}
								itemSize={itemHeight}
								itemCount={users.length}
								// renderItem={this.renderItem}
								style={styles.list}
								showsVerticalScrollIndicator={false}
								contentContainerStyle={styles.listContentContainer}
								// numColumns={2}
								// columnWrapperStyle={styles.columnWrapper}
								initialNumToRender={8}
								keyExtractor={this._keyExtractor}
								itemKey={this.itemKey}
								useIsScrolling
							>
								{this.renderItem}
							</List>
						);
					}}
				</AutoSizer>
				{/* <Layout style={styles.floatingButtonContainer}>
					<Button style={{}}>Call</Button>
				</Layout> */}
				<CallActions themedStyle={style.callActions} />
			</Layout>
		);
	}
}

export const UsersListWithStyles = withStyles(UsersList, theme => ({
	buttonGroup: {
		backgroundColor: theme['color-primary-100'],
		marginHorizontal: 0
	},
	// remove
	callActions: {
		backgroundColor: theme['color-primary-500'],
		position: 'absolute',
		width: '100%',
		bottom: 0
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
		height: '100%',
		backgroundColor: '#101426'
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
		width: '100%',
		backgroundColor: '#101426'
	},
	listContentContainer: {
		// flexShrink: 1,
		// flexDirection: 'row',
		// flexWrap: 'wrap',
		order: -1,
		justifyContent: 'space-between',
		backgroundColor: '#101426'
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
	// REMOVE
	// callActions: {
	// 	backgroundColor: theme['color-primary-500'],
	// 	position: 'absolute',
	// 	width: '100%',
	// 	bottom: 0
	// },
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
