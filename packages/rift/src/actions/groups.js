export const FETCH_GROUPS = 'FETCH_GROUPS';
export const FETCH_MY_GROUPS = 'FETCH_GROUPS';

export const SET_GROUPS = 'SET_GROUPS';
export const setGroups = ({ lists, data }) => ({
	type: SET_GROUPS,
	payload: data,
	lists
});

export const FETCH_GROUP_MEMBERS = 'FETCH_GROUP_MEMBERS';
export const fetchGroupMembers = gid => ({ type: FETCH_GROUP_MEMBERS, gid });
export const SET_GROUP_MEMBERS = 'SET_GROUP_MEMBERS';
export const setGroupMembers = (gid, members) => ({
	type: SET_GROUP_MEMBERS,
	members,
	gid
});
