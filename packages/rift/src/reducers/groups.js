import { combineReducers } from 'redux';
import produce from 'immer';
import {
	SET_GROUPS,
	SET_GROUP_MEMBERS,
	ADD_MEMBER,
	UPDATE_MEMBER
} from '@actions';
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
				newGroups.forEach(group => {
					draft[group.gid] = groupData(group, action);
				});
				// change to be handled in graphql
				if (action?.lists?.memberOf) {
					action.lists.memberOf.forEach(gid => (draft[gid].memberOf = true));
				}
				break;
			}
			case UPDATE_MEMBER: {
				const { gid, payload } = action;
				const { update, id, self } = payload;
				if (!self) break;
				const memberOfKey = {
					JOINED: true,
					LEFT: false,
					[undefined]: state[gid].memberOf
				};
				const val = memberOfKey[update];

				draft[gid].memberOf = val;
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
			case ADD_MEMBER: {
				const { self = false, gid } = action;
				if (self && !state.memberOf.some(existing => existing == gid)) {
					draft.memberOf.push(gid);
				}
				break;
			}
			case UPDATE_MEMBER: {
				const { gid, payload } = action;
				console.log(gid);

				var gidVar = gid;
				const { update, id, self } = payload;
				if (self) {
					if (
						update == 'JOINED' &&
						!state.memberOf.some(existing => existing == gid)
					) {
						draft.memberOf.push(gid);
						break;
					}
					if (update == 'LEFT') {
						console.log(gid, gidVar);
						const updatedList = state.memberOf.filter(existing => existing !== gid);
						console.log(updatedList);

						draft.memberOf = updatedList;
						break;
					}
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

export const memberList = (state = {}, action) => {
	switch (action.type) {
		case UPDATE_MEMBER: {
			switch (action.payload.update) {
				case 'JOIN': {
					const { gid, id } = action;
					const existing = state[gid] || [];
					if (existing.some(uid => uid == id)) break;
					draft[gid] = [...existing, id];
					break;
				}
			}
		}
	}
};
export const members = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_GROUP_MEMBERS: {
				const { gid, members } = action;
				draft[gid] = members;
				break;
			}
			case UPDATE_MEMBER: {
				const { gid, payload } = action;
				const { update, id } = payload;
				if (update == 'JOINED') {
					const existing = state[gid] || [];
					if (existing.some(uid => uid == id)) break;
					draft[gid] = [...existing, id];
					break;
				}
				if (update == 'LEFT') {
					const existing = state[gid] || [];
					const updated = state[gid].filter(uid => uid !== id);
					// console.log(testlist);

					//if (existing.some(uid => uid == id)) break;
					draft[gid] = updated;
					break;
				}
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
