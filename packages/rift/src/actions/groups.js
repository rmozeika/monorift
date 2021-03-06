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
export const WATCH_GROUP = 'WATCH_GROUP';
export const watchGroup = gid => ({
	type: WATCH_GROUP,
	gid
});
export const ADD_MEMBER = 'ADD_MEMBER';
export const addMember = ({ gid, id, self = false }) => ({
	type: ADD_MEMBER,
	gid,
	id,
	self
});

export const UPDATE_MEMBER = 'UPDATE_MEMBER';
export const updateMember = ({ gid, id, uid, self = false, update }) => ({
	type: UPDATE_MEMBER,
	gid,
	payload: {
		id: id || uid,
		update,
		self
	}
});
