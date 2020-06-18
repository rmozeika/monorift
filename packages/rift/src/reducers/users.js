import { combineReducers } from 'redux';
import produce from 'immer';
import {
	SET_USERS,
	SET_ONLINE_USERS,
	SET_FRIENDS,
	ADD_CALL,
	REMOVE_CALL,
	SET_SEARCH_FILTER,
	UPDATE_USER,
	CALL_ACTIVE,
	END_CALL,
	ADD_CONNECTION,
	ANSWER_INCOMING,
	ADD_USER,
	LOGIN
} from '@actions';

export const initialState = {
	status: {
		gotOnline: false, //remove
		gotFriends: false, //remove
		gotUsers: false
	},
	// online: {
	// 	users: [],
	// 	gotOnlineUsers: false
	// },
	// remove this
	// friends: [],
	byId: {},
	allIds: {
		master: [],
		friends: {
			all: [],
			online: [],
			offline: []
		}
	},
	queued: {},
	search: { filter: '' }
};
const onlineUsers = (state, action) => {};
export const status = (state = {}, action) => {
	switch (action.type) {
		case SET_ONLINE_USERS:
			return { ...state, gotOnline: true };
		case SET_FRIENDS:
			return { ...state, gotFriends: true };
		case SET_USERS:
			return { ...state, gotUsers: true };
		default:
			return state;
	}
};

export const queued = (state = [], action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case ADD_CALL: {
				const { user } = action.payload;
				const { id } = user;
				draft[id] = {
					...action.payload.user
				};
				break;
			}
			case REMOVE_CALL:
				const { user } = action.payload;
				const { id } = user;
				delete draft[id];
				// draft.filter(user => user.username !== action.payload.user.username);
				break;
			default:
				return draft;
		}
	});
	return resultProduce;
};
const isFriendFromStatus = friendStatus => {
	return ['A', 'P', 'S'].some(key => key == friendStatus);
};
const getFriendDataFromStatus = status => {
	return {
		isFriend: status == 'P' || status == 'A' || status == 'S',
		friendStatus: status || null
	};
};
const userDataDefault = {
	checked: false,
	calling: false,
	connected: false
};
const userData = (state = {}, action) => {
	switch (action.type) {
		case SET_USERS: {
			const { status, online } = state;
			const friendData = getFriendDataFromStatus(status);
			const added = {
				...state,
				...friendData,
				online,
				...userDataDefault
			};
			return added;
		}
		case ADD_USER: {
			const { user } = action;
			const { status, isFriend, online } = user;
			const friendData = getFriendDataFromStatus(status);
			return {
				...user,
				...friendData,
				online,
				...userDataDefault
			};
		}
		// fallinback, this shouldn't be happening, upsert if doesnt exisst
		case UPDATE_USER: {
			const { user, data } = action.payload;
			const status = data.status || user.status;
			const friendData = getFriendDataFromStatus(status);
			return {
				...user,
				...friendData,
				...userDataDefault,
				...data
			};
		}
		case LOGIN.SUCCESS: {
			return {
				...state,
				isFriend: false,
				friendStatus: null,
				online: true,
				self: true,
				...userDataDefault
			};
		}
		default:
			return state;
	}
};
export const byId = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_USERS: {
				const users = action.payload.forEach(user => {
					draft[user.id] = userData(user, action);
				});

				break;
			}
			case LOGIN.SUCCESS: {
				const user = action.payload;
				draft[user.id] = userData(user, action);
			}
			case UPDATE_USER: {
				const { payload, id } = action;
				const { data, user } = payload;
				if (state[id]) {
					const entries = Object.entries(data);
					entries.forEach(([key, value]) => {
						draft[id][key] = value;
					});
				}
				// otherwise addNewUser will handle it
				// else {
				// 	draft[id] = userData({}, action);
				// }
				break;
			}
			case ADD_USER: {
				const { id } = action;
				draft[id] = userData({}, action);
				break;
			}
			case ADD_CONNECTION: {
				draft[action.id].calling = true;
				break;
			}
			case CALL_ACTIVE: {
				draft[action.id].connected = action.payload.active;
				draft[action.id].calling = false;
				break;
			}
			case ANSWER_INCOMING: {
				draft[action.id].connected = action.payload;
				break;
			}
			case END_CALL: {
				draft[action.id].connected = false;
				draft[action.id].calling = false;
				break;
			}
			case ADD_CALL:
				draft[action.payload.user.id].checked = true;
				break;
			case REMOVE_CALL:
				draft[action.payload.user.id].checked = false;
				break;
			default:
				return draft;
		}
	});

	return resultProduce;
};

export const allIds = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_USERS: {
				const ids = action.payload.map(user => user.id);

				const addedFriends = action.payload.filter(user =>
					isFriendFromStatus(user.status)
				);
				draft['master'] = ids;
				draft['friends'].all = addedFriends.map(friend => friend.id);
				break;
				// CHANGE THIS! MERGE THIS WITH ONLIN
			}
			case UPDATE_USER: {
				if (
					action.payload.data?.isFriend &&
					!state.friends.all.some(id => id == action.id)
				) {
					draft['friends'].all.push(action.id);
				}

				break;
			}
			case ADD_USER: {
				draft.master.push(action.id);
				break;
			}

			default:
				return draft;
		}
	});
	return resultProduce;
};
export const search = (state = {}, action) => {
	switch (action.type) {
		case SET_SEARCH_FILTER:
			return { ...state, filter: action.payload };
		default:
			return state;
	}
};

const usersReducer = combineReducers({
	status,
	// online,
	// friends,
	queued,
	byId,
	allIds,
	search
});
export default usersReducer;
