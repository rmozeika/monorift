import { combineReducers } from 'redux';
import produce from 'immer';
import { SET_GROUPS, SET_GROUP_MEMBERS } from '@actions';
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
			const { gid, name, creator_oauth_id: creator } = group;
			return { gid, name, creator };
		}
	}
};
export const byId = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_GROUPS: {
				const groups = action.payload.forEach(group => {
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
				draft['master'] = action.lists.master;
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
