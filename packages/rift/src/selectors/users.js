import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from 'reselect';
import { defaultEqualityCheck, resultCheckMemoize } from './utils';
import shallowEqual from 'fbjs/lib/shallowEqual';

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
export const onlineUsernames = state => state.users.allIds.nonFriends.online;
export const offlineUsernames = state => state.users.allIds.nonFriends.offline;
export const onlineFriendUsernames = state => {
	return state.users.allIds.friends.online;
};
export const offlineFriendUsernames = state => {
	return state.users.allIds.friends.offline;
};

export const getOnlineOfflineUsernames = createSelector(
	[onlineUsernames, offlineUsernames],
	(online, offline) => {
		return online.concat(offline);
	}
);
export const getFriendsOnlineOfflineUsernames = createSelector(
	[onlineFriendUsernames, offlineFriendUsernames],
	(online, offline) => {
		return online.concat(offline);
	}
);

export const getOnlineOffline = createSelector(
	[getTab, getFriendsOnlineOfflineUsernames, getOnlineOfflineUsernames],
	(tab, friends, nonFriends) => {
		// const tabTypeOffset = isLoggedIn ? 0 : 1;
		const tabType = getTabType(tab);
		switch (tabType) {
			case 'friends':
				return friends;
			case 'users':
				return nonFriends;
		}
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
		// getSearchFilter,
		getTab,
		getOnlineOffline,
		gotOnline,
		gotFriends,
		loggedIn
	],
	(tab, users, didGetOnline, didGetFriends, isLoggedIn) => {
		// CHANGE THIS spaghetti code
		const tabTypeOffset = isLoggedIn ? 0 : 1;
		const tabType = getTabType(tab + tabTypeOffset);
		switch (tabType) {
			case 'friends':
				if (!didGetFriends || !didGetOnline) return [];
				// if (searchFilter == '') {
				return users;
			// }
			// const filteredFriends = filterUsers(users, searchFilter);
			// return filteredFriends;
			// const friendsUsernames = Object.keys(users).filter(
			// 	username => users[username].isFriend
			// );

			// const friendsOnlineOffline = sortOnlineOffline(users, friendsUsernames);
			// return friendsOnlineOffline;
			case 'users':
				if (!didGetOnline) {
					return []; // usersOnlineOfflineBase;
				}
				// if (searchFilter == '') {
				return users;
			// }
			// const filtered = filterUsers(users, searchFilter);
			// return filtered;
			// REMOVE
			// const nonFriendUsernames = isLoggedIn
			// 	? usernames.filter(username => !users[username].isFriend)
			// 	: usernames;
			// const visibleUsers = sortOnlineOffline(users, nonFriendUsernames);
			// return visibleUsers.online.concat(visibleUsers.offline);
		}
	}
);
export const getVisibleUsersOld = createSelector(
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
export const getVisibleUsersFiltered = createSelector(
	[getSearchFilter, getVisibleUsers],
	(filter, users) => {
		if (filter == '') {
			return users;
		}
		console.log('FILTER', 'filtered started');
		const filtered = filterUsers(users, filter);
		console.log('FILTER', 'filtered done');
		return filtered;
	}
);
// const getAllIds = state => state.users.allIds;
// const getAllIds = createSelector([getAllIds])
// export const getNonFriendUsers = (state) => {

// }
import createCachedSelector from 're-reselect';
import { search } from '@src/reducers/users';
const getUserById = (state, props) => state.users.byId[props.id];

// const getUserData = state => state.world;
export const getUser = createCachedSelector([getUserById], users => {
	return users;
})(
	/*
	 * Re-reselect resolver function.
	 * Cache/call a new selector for each different "listId"
	 */
	(state, props) => props.id
);
const getVis = (state, props) =>
	createSelector(
		[getFriendsOnlineOfflineUsernames, getOnlineOfflineUsernames],
		(friends, users) => {}
	);
const getVisOnline = (state, props) => {
	return state.users.allIds[props.route.params.listType].online;
};
const getVisOffline = (state, props) =>
	state.users.allIds[props.route.params.listType].offline;
// REMOVE
const getVisibleUsersByFilter = (state, props) => {
	if (props.listType == 'friends') {
		const onlineFriends = onlineFriendUsernames(state);
		const offlineFriends = offlineFriendUsernames(state);
		return onlineFriends.concat(offlineFriends);
	}
	const online = onlineUsernames(state);
	const offline = offlineUsernames(state);
	return online.concat(offline);
};
export const getVisibleOnline = createCachedSelector([getVisOnline], online => {
	return online;
})((state, props) => props.route.params.listType);

export const getVisibleUserlist = createCachedSelector(
	// [getVisibleUsersByFilter],
	[getVisOnline, getVisOffline],
	(online, offline) => online.concat(offline)
)((state, props) => props.route.params.listType);

// const getVisOnlineWithSearch = createSelector(
// 	[getSearchFilter, getVisOnline],

// 	state, props) => {

// 	return state.users.allIds[props.route.params.listType].online;
// };
const getVisOfflineWithSearch = (state, props) =>
	state.users.allIds[props.route.params.listType].offline;

// use getUsers

// use
const getUserIdsByList = (state, props) => {
	// CHANGE THIS
	const { listType } = props.route.params;
	if (listType == 'master') {
		return state.users.allIds[listType];
	}
	return state.users.allIds[listType].all;
};
const selectIds = state => state.ids; // dont use REMOVE

const createSelectorCustom = createSelectorCreator(
	resultCheckMemoize,
	shallowEqual
);
// don't rerun selectors if ids don't change (even if usersbyIds do that aren't returned)
const selectDenormUsers = createSelectorCustom(
	getUsers,
	getUserIdsByList,
	(objectsById, ids) => ids.map(id => objectsById[id])
);
export const getUsersByOnline = createSelector([selectDenormUsers], users => {
	const onlineUsers = [];
	const offlineUsers = [];

	users.forEach(({ oauth_id, online }) => {
		if (online) {
			onlineUsers.push(oauth_id);
		} else {
			offlineUsers.push(oauth_id);
		}
	});
	return onlineUsers.concat(offlineUsers);
});
const getUsersByFriendStatus = (state, props) => {
	const users = getUsers(state);
	const ids = Object.keys(users);
	// const online = [];
	// const offline = [];
	const listType = props.route.params.listType;
	const filteredUsers = [];
	ids.forEach(id => {
		const user = users[id];
		if (
			(listType == 'friends' && !user.isFriend) ||
			(listType == 'users' && user.isFriend)
		)
			return;
		filteredUsers.push(user);
		return;
		// if (user.online) {
		// 	online.push(id);
		// } else {
		// 	offline.push(id);
		// }
	});
	return filteredUsers;
};

// const getT = (state, props) => {
// 	const listType = props.route.params.listType;
// 	if (listType == friends) {
// 		return getFriends(state)
// 	};
// 	return getUserMasterlist(state);
// };
// export const getVisUsersAlt = createCachedSelector(
// 	// [getUsersByFriendStatus],
// 	[getTest],
// 	(users) => {
// 		// const online = [];
// 		const offline = [];
// 		const online = [];
// 		users.forEach(user => {
// 			if (user.online) {
// 				online.push(user.oauth_id);
// 			} else {
// 				offline.push(user.oauth_id);
// 			};
// 		});
// 		return online.concat(offline);
// 	}
// )((state, props) => props.route.params.listType);

export const getVisibleUserlistSearch = createCachedSelector(
	// [getVisibleUsersByFilter],
	[getSearchFilter, getVisOnline, getVisOffline],
	(filter, online, offline) => {
		const usersOrderedByOnlineOffline = online.concat(offline);
		if (!filter) {
			return usersOrderedByOnlineOffline;
		}
		return filterUsers(usersOrderedByOnlineOffline, filter);
		// const usersFiltered = usersOrderedByOnlineOffline.filter(username => {
		// 	return username
		// });
	}
)((state, props) => props.route.params.listType);

const getAllUsers = state => {
	return state.users.allIds.master;
};
export const getUserMasterlist = createSelector([getAllUsers], users => {
	return users;
});
// export const makeVisibleUsers = () => {
// 	return createSelector(
// 		[getTab, getFriendsOnlineOfflineUsernames, getOnlineOfflineUsernames],
// 		(tab, friends, nonFriends) => {
// 			// const tabTypeOffset = isLoggedIn ? 0 : 1;
// 			const tabType = getTabType(tab);
// 			switch (tabType) {
// 				case 'friends':
// 					return friends;
// 				case 'users':
// 					return nonFriends;
// 			}
// 		}
// 	);
// 	// return createSelector(
// 	// 	[ getVisibilityFilter, getTodos ],
// 	// 	(visibilityFilter, todos) => {
// 	// 		switch (visibilityFilter) {
// 	// 		case 'friends':
// 	// 			return todos.filter(todo => todo.completed)
// 	// 		case 'users':
// 	// 			return todos.filter(todo => !todo.completed)
// 	// 		default:
// 	// 			return todos
// 	// 		}
// 	// 	}
// 	// )
// };

// export default makeGetVisibleTodos;
// const getCountryData = createCachedSelector(
//   getUsers,
//   (state, country) => country,
//   (world, country) => extractData(world, country),
// )(
//   (state, country) => country, // Cache selectors by country name
// );

// const afghanistan = getCountryData(state, 'afghanistan');
// const zimbabwe = getCountryData(state, 'zimbawe');
