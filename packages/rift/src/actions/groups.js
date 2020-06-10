export const SET_GROUPS = 'SET_GROUPS';
export const setGroups = ({ lists, data }) => ({
	type: SET_GROUPS,
	payload: data,
	lists
});
