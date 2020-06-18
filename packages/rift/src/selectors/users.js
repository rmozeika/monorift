import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from 'reselect';
import createCachedSelector from 're-reselect';

import { resultCheckMemoize } from './utils';
import shallowEqual from 'fbjs/lib/shallowEqual';

export const getTab = state => state.view.tab;
export const getUsers = state => state.users.byId;
export const getOnlineUsers = state => state.users.online;
export const getFriends = state => state.users.friends;
export const gotOnline = state => state.users.status.gotOnline;
export const gotFriends = state => state.users.status.gotFriends;
export const getSearchFilter = state => state.users.search.filter;
export const filterUsers = (users, filter) => {
	const filterRegex = new RegExp(filter, 'i');
	return users.filter(user => user.match(filterRegex));
};

export const getUserById = (state, props) => state.users.byId[props.id];
export const getUser = createCachedSelector([getUserById], users => {
	return users;
})((state, props) => props.id);

const getUserIdsByList = (state, props) => {
	// CHANGE THIS
	const { listType } = props.route.params;
	if (listType == 'master') {
		return state.users.allIds[listType];
	}
	return state.users.allIds[listType].all;
};

const createSelectorCustom = createSelectorCreator(
	resultCheckMemoize,
	shallowEqual
);

const cachedDenormUsers = createCachedSelector(
	[getUsers, getUserIdsByList],
	(objectsById, ids) => {
		return ids.map(id => objectsById[id]);
	}
)((state, props) => props.route.params.listType, {
	selectorCreator: createSelectorCustom
});

export const getUsersDataByOnlineCached = createCachedSelector(
	[cachedDenormUsers],
	users => {
		const onlineUsers = [];
		const offlineUsers = [];
		console.log('RAN USER SELECTOR: MAIN');

		users.forEach(user => {
			const { online } = user;
			if (online) {
				onlineUsers.push(user);
			} else {
				offlineUsers.push(user);
			}
		});
		return onlineUsers.concat(offlineUsers);
	}
)((state, props) => props.route.params.listType);

// UNUSED, only difference between above is that this is just for ids
export const getUsersByOnlineCached = createCachedSelector(
	[cachedDenormUsers],
	users => {
		const onlineUsers = [];
		const offlineUsers = [];
		console.log('RAN USER SELECTOR: MAIN');

		users.forEach(({ id, online }) => {
			if (online) {
				onlineUsers.push(id);
			} else {
				offlineUsers.push(id);
			}
		});
		return onlineUsers.concat(offlineUsers);
	}
)((state, props) => props.route.params.listType);

// USED
const filterByUsername = (users, filter) => {
	const filterRegex = new RegExp(filter, 'i');

	const filteredIds = [];
	users.forEach(user => {
		const matched = user.username.match(filterRegex);
		if (matched) filteredIds.push(user.id);
	});
	return filteredIds;
};

export const filteredUsersByOnline = createCachedSelector(
	// [getVisibleUsersByFilter],
	[getSearchFilter, getUsersDataByOnlineCached],
	(filter, users) => {
		if (filter == '' || filter == undefined) {
			return users.map(({ id }) => id);
		}
		const filteredUsers = filterByUsername(users, filter);
		// const filteredUsers =  filterUserData(users, userData, filter);
		return filteredUsers;
		// const usersFiltered = usersOrderedByOnlineOffline.filter(username => {
		// 	return username
		// });
	}
)((state, props) => props.route.params.listType);
