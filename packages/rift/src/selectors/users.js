import { createSelector } from 'reselect';
import { getTabType } from '../reducers/view';
import { loggedIn } from './auth.js';
export const getTab = state => state.view.tab;
export const getUsers = state => state.users.byId;
export const getOnlineUsers = state => state.users.online;
export const getFriends = state => state.users.friends;
export const gotOnline = state => state.users.status.gotOnline;
export const gotFriends = state => state.users.status.gotFriends;
const sortOnlineOffline = (users, usernames) => {
	let onlineOffline = {
		online: [],
		offline: []
	};
	usernames.forEach(username => {
		// console.log(acc);
		const user = users[username];
		if (user.online) {
			onlineOffline.online.push(username);
			return;
		}
		onlineOffline.offline.push(username);
	});
	return onlineOffline;
};
const usersOnlineOfflineBase = {
	online: [],
	offline: []
};
export const getSearchFilter = state => state.users.search.filter;

export const sortOnline = createSelector([getUsers], users => {
	return Object.keys(users);
});
export const onlineUsernames = state => state.users.allIds.online;
export const offlineUsernames = state => state.users.allIds.offline;

export const getOnlineOfflineUsernames = createSelector(
	[onlineUsernames, offlineUsernames],
	(online, offline) => {
		return online.concat(offline);
	}
);

export const filterUsers = (users, filter) => {
	const filterRegex = new RegExp(filter, 'i');
	return users.filter(user => user.match(filterRegex));
};
export const getVisibleUsers = createSelector(
	// [getTab, getUsers, loggedIn],
	// (tab, users, isLoggedIn) => {
	[
		getSearchFilter,
		getTab,
		getOnlineOfflineUsernames,
		gotOnline,
		gotFriends,
		loggedIn
	],
	(searchFilter, tab, users, didGetOnline, didGetFriends, isLoggedIn) => {
		// CHANGE THIS spaghetti code
		const tabTypeOffset = isLoggedIn ? 0 : 1;
		const tabType = getTabType(tab + tabTypeOffset);
		switch (tabType) {
			case 'friends':
				if (!didGetFriends || !didGetOnline) return [];
				if (searchFilter == '') {
					return users;
				}
				const filteredFriends = filterUsers(users, searchFilter);
				return filteredFriends;
			// const friendsUsernames = Object.keys(users).filter(
			// 	username => users[username].isFriend
			// );

			// const friendsOnlineOffline = sortOnlineOffline(users, friendsUsernames);
			// return friendsOnlineOffline;
			case 'users':
				if (!didGetOnline) {
					return []; // usersOnlineOfflineBase;
				}
				if (searchFilter == '') {
					return users;
				}
				const filtered = filterUsers(users, searchFilter);
				return filtered;
				// REMOVE
				const nonFriendUsernames = isLoggedIn
					? usernames.filter(username => !users[username].isFriend)
					: usernames;
				const visibleUsers = sortOnlineOffline(users, nonFriendUsernames);
				return visibleUsers.online.concat(visibleUsers.offline);
		}
	}
);
// const getAllIds = state => state.users.allIds;
// const getAllIds = createSelector([getAllIds])
// export const getNonFriendUsers = (state) => {

// }
import createCachedSelector from 're-reselect';
import { search } from '@src/reducers/users';
const getUserByUsername = (state, props) => state.users.byId[props.username];

// const getUserData = state => state.world;
export const getUser = createCachedSelector([getUserByUsername], users => {
	return users;
})(
	/*
	 * Re-reselect resolver function.
	 * Cache/call a new selector for each different "listId"
	 */
	(state, props) => props.username
);
// const getCountryData = createCachedSelector(
//   getUsers,
//   (state, country) => country,
//   (world, country) => extractData(world, country),
// )(
//   (state, country) => country, // Cache selectors by country name
// );

// const afghanistan = getCountryData(state, 'afghanistan');
// const zimbabwe = getCountryData(state, 'zimbawe');
