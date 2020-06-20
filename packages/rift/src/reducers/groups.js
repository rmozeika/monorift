import { combineReducers } from 'redux';
import produce from 'immer';
import { SET_GROUPS, SET_GROUP_MEMBERS, ADD_MEMBER } from '@actions';
export const initialState = {
	byId: {},
	allIds: {
		master: [],
		memberOf: []
	},
	members: {
		// gid: [members]
	}
	// memberOf: {

	// }
};
const groupData = (group, action) => {
	switch (action.type) {
		case SET_GROUPS: {
			const { gid, name, creator, gravatar } = group;
			return { gid, name, creator, gravatar };
		}
	}
};
export const byId = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_GROUPS: {
				const newGroups = action.payload.filter(({ gid }) => !state[gid]);
				const groups = newGroups.forEach(group => {
					draft[group.gid] = groupData(group, action);
				});
				break;
			}
		}
	});
	return resultProduce;
};

export const allIds = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_GROUPS: {
				if (action.lists.master) {
					draft['master'] = action.lists.master;
				}
				if (action.lists.memberOf) {
					draft['memberOf'] = action.lists.memberOf;
				}
				break;
			}
		}
	});
	return resultProduce;
};

// export const memberData = (state = {}, action) => {
// 	switch (action.type) {
// 		case SET_GROUP_MEMBERS: {
// 			const { gid, name, creator } = group;
// 			return { gid, name, creator };
// 		}
// 	}
// }
export const members = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_GROUP_MEMBERS: {
				const { gid, members } = action;
				draft[gid] = members;
				break;
			}
			case ADD_MEMBER: {
				const { gid, id } = action;
				const existing = state[gid] || [];
				if (existing.some(uid => uid == id)) break;
				draft[gid] = [...existing, id];
				break;
			}
		}
	});
	return resultProduce;
};
const groupsReducer = combineReducers({
	byId,
	allIds,
	members
});
export default groupsReducer;
