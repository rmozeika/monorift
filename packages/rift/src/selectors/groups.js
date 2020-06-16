import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from 'reselect';
import createCachedSelector from 're-reselect';

import { resultCheckMemoize } from './utils';
import shallowEqual from 'fbjs/lib/shallowEqual';

import { getUsers, getSearchFilter, filterByName } from './users';

export const getGroups = state => state.groups.byId;
// export const getSearchFilter = state => {
//     return '';
//     //state.users.search.filter;
// };
export const listTypeCacheKey = (state, props) => {
	return props.listType || props.route.params.listType;
};

const createSelectorCustom = createSelectorCreator(
	resultCheckMemoize,
	shallowEqual
);
export const getGroupByGid = (state, props) => state.groups.byId[props.gid];
export const getGroup = createCachedSelector([getGroupByGid], groups => {
	return groups;
})((state, props) => props.gid);

const getMemberIdsByGroup = (state, props) => {
	// CHANGE THIS
	// const { listType } = props.route.params;
	// if (listType == 'master') {
	// 	return state.groups.allIds[listType];
	// }
	const listType = listTypeCacheKey(state, props);
	return state.groups.members[listType];
};
// USED
const cachedDenormMembers = createCachedSelector(
	[getUsers, getMemberIdsByGroup],
	(objectsById, ids = []) => {
		return ids.map(id => objectsById[id]);
	}
)(listTypeCacheKey, {
	selectorCreator: createSelectorCustom
});

export const getMembersDataByOnlineCached = createCachedSelector(
	[cachedDenormMembers],
	(users = []) => {
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
)(listTypeCacheKey);

// USED
export const filteredMembers = createCachedSelector(
	// [getSearchFilter, getUsers],
	[getSearchFilter, getMembersDataByOnlineCached],
	(filter, users) => {
		if (filter == '' || filter == undefined) {
			return users.map(({ oauth_id }) => oauth_id);
		}

		const filteredGroups = filterByName(members, filter);
		return filteredGroups;
	}
)(listTypeCacheKey);

// FOR GROUP LIST
//
export const getVisibleGroupGids = (state, props) => {
	// listtype is memberOf or master
	const listType = listTypeCacheKey(state, props);
	return state.groups.allIds[listType];
};

const cachedDenormGroups = createCachedSelector(
	[getGroups, getVisibleGroupGids],
	(objectsById, gids) => {
		// CHANGE THIS, get groups to be cached
		// for managing extra group fields
		return gids.map(gid => objectsById[gid]);
	}
)(listTypeCacheKey, {
	selectorCreator: createSelectorCustom
});
export const getGroupsDataByActiveCached = createCachedSelector(
	[cachedDenormGroups],
	groups => {
		if (!groups) return [];
		const activeGroups = [];
		const offlineGroups = [];
		console.log('RAN GROUP SELECTOR: MAIN');

		groups.forEach(group => {
			// change this, get active status;
			const { active = false } = group;
			if (active) {
				activeGroups.push(group);
			} else {
				offlineGroups.push(group);
			}
		});
		return activeGroups.concat(offlineGroups);
	}
)(listTypeCacheKey);

// USED
const filterGroupsByName = (groups, filter) => {
	const filterRegex = new RegExp(filter, 'i');

	const filteredGids = [];
	groups.forEach(group => {
		const matched = group.name.match(filterRegex);
		if (matched) filteredGids.push(group.gid);
	});
	return filteredGids;
};
export const filteredGroups = createCachedSelector(
	[getSearchFilter, getGroupsDataByActiveCached],
	(filter, groups) => {
		if (filter == '' || filter == undefined) {
			return groups.map(({ gid }) => gid);
		}
		const filteredGroups = filterGroupsByName(groups, filter);
		return filteredGroups;
	}
)(listTypeCacheKey);
