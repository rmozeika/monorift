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
			onlineOffline.online.push(user);
			return;
		}
		onlineOffline.offline.push(user);
	});
	return onlineOffline;
};
const usersOnlineOfflineBase = {
	online: [],
	offline: []
};
export const getVisibleUsers = createSelector(
	// [getTab, getUsers, loggedIn],
	// (tab, users, isLoggedIn) => {
	[getTab, getUsers, gotOnline, gotFriends, loggedIn],
	(tab, users, didGetOnline, didGetFriends, isLoggedIn) => {
		// CHANGE THIS spaghetti code
		const tabTypeOffset = isLoggedIn ? 0 : 1;
		const tabType = getTabType(tab + tabTypeOffset);
		switch (tabType) {
			case 'friends':
				if (!didGetFriends || !didGetOnline) return usersOnlineOfflineBase;
				const friendsUsernames = Object.keys(users).filter(
					username => users[username].isFriend
				);

				const friendsOnlineOffline = sortOnlineOffline(users, friendsUsernames);
				return friendsOnlineOffline;
			case 'users':
				if (!didGetOnline) {
					debugger; //remove
					return usersOnlineOfflineBase;
				}
				debugger; //remove
				const usernames = Object.keys(users);
				const nonFriendUsernames = isLoggedIn
					? usernames.filter(username => !users[username].isFriend)
					: usernames;
				const usersOnlineOffline = sortOnlineOffline(users, nonFriendUsernames);
				return usersOnlineOffline;
			// Object.keys(users)
			//     .filter(user => user.online);
		}
	}
);

// export const getNonFriendUsers = (state) => {

// }
