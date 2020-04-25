import { combineReducers } from 'redux';
import produce from 'immer';
import {
	SET_USERS,
	FETCH_ONLINE_USERS,
	SET_ONLINE_USERS,
	SET_FRIENDS,
	ADD_CALL,
	REMOVE_CALL,
	ADD_ONLINE_USER,
	REMOVE_ONLINE_USER,
	SET_SEARCH_FILTER,
	UPDATE_USER,
	CALL_ACTIVE,
	ADD_CONNECTION,
	ANSWER_INCOMING,
	ADD_USER
} from '@actions';
const isFriendFromStatus = friendStatus => {
	return ['A', 'P', 'S'].some(key => key == friendStatus);
};
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
// export const online = (state = {}, action) => {
// 	switch (action.type) {
// 		case SET_ONLINE_USERS:
// 			const users = action.payload.map(user => ({
// 				...user,
// 				checked: false
// 			}));
// 			return { ...state, gotOnlineUsers: true, users };
// 		case ADD_ONLINE_USER:
// 			const userPresent = state.users.some(user => user.oauth_id == action.id);
// 			if (userPresent) return state;
// 			let usersAdd = [...state.users, { ...action.payload, checked: false }];
// 			const addedToState = { ...state, users: usersAdd };
// 			return addedToState;
// 		case REMOVE_ONLINE_USER:
// 			let usersRemoved = state.users.filter(user => action.id !== user.oauth_id);
// 			return { ...state, users: usersRemoved };
// 		case ADD_CALL:
// 			let addUsers = state.users.map(({ checked, oauth_id }, index) => {
// 				if (action.payload.index == index) {
// 					return { oauth_id, checked: true };
// 				}
// 				return { checked, oauth_id };
// 			});
// 			return { ...state, users: addUsers };
// 		case REMOVE_CALL:
// 			let removeUsers = state.users.map(({ checked, oauth_id }, index) => {
// 				if (action.payload.index == index) {
// 					return { oauth_id, checked: false };
// 				}
// 				return { checked, oauth_id };
// 			});
// 			return { ...state, users: removeUsers };

// 		default:
// 			return state;
// 	}
// };
// export const friends = (state = {}, action) => {
// 	switch (action.type) {
// 		case SET_FRIENDS:
// 			return [...state, action.payload];
// 		default:
// 			return state;
// 	}
// };
export const queued = (state = [], action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case ADD_CALL: {
				const { user } = action.payload;
				const { oauth_id } = user;
				draft[oauth_id] = {
					...action.payload.user
				};
				break;
			}
			case REMOVE_CALL:
				const { user } = action.payload;
				const { oauth_id } = user;
				delete draft[oauth_id];
				// draft.filter(user => user.username !== action.payload.user.username);
				break;
			default:
				return draft;
		}
	});
	return resultProduce;
};
const userData = (state = {}, action) => {
	switch (action.type) {
		case SET_USERS: {
			const { status, online } = state;
			const added = {
				...state,
				isFriend: status == 'P' || status == 'A' || status == 'S',
				friendStatus: status,
				online,
				checked: false,
				calling: false,
				connected: false
			};
			return added;
		}
		case ADD_USER: {
			const { user } = action;
			const { status, isFriend } = user;
			return {
				...user,
				isFriend: isFriend || status == 'P' || status == 'A' || status == 'S',
				friendStatus: status,
				online: false,
				checked: false,
				calling: false,
				connected: false
			};
		}
		// fallinback, this shouldn't be happening, upsert if doesnt exisst
		case UPDATE_USER: {
			const { user, data } = action.payload;
			const status = data.status || user.status;
			return {
				...user,
				isFriend: status == 'P' || status == 'A' || status == 'S',
				friendStatus: status,
				online: false,
				checked: false,
				calling: false,
				connected: false,
				...data
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
					draft[user.oauth_id] = userData(user, action);
				});

				// const users = action.payload.forEach(({ status, online, ...user }) => {
				// 	draft[user.oauth_id] = {
				// 		...user,
				// 		isFriend: status == 'P' || status == 'A' || status == 'S',
				// 		friendStatus: status,
				// 		online,
				// 		checked: false,
				// 		calling: false,
				// 		connected: false
				// 	};
				// }, {});
				break;
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
				// return {
				// 	id: action.id,
				// // status: 'started',
				// 	active: false,
				// 	incoming: false,
				// };
			}
			case ANSWER_INCOMING: {
				draft[action.id].connected = action.payload;
				break;
				// return {
				// 	id: action.id,
				// // status: 'started',
				// 	active: false,
				// 	incoming: false,
				// };
			}
			// case SET_ONLINE_USERS:
			// 	action.payload.forEach(user => {
			// 		const { oauth_id } = user;
			// 		if (!draft[oauth_id]) return;
			// 		draft[oauth_id].online = true;
			// 	});
			// 	break;
			// case ADD_ONLINE_USER: {
			// 	draft[action.id].online = true;
			// 	break;
			// }
			// case REMOVE_ONLINE_USER: {
			// 	draft[action.id].online = false;
			// 	break;
			// }
			case ADD_CALL:
				draft[action.payload.user.oauth_id].checked = true;
				break;
			case REMOVE_CALL:
				draft[action.payload.user.oauth_id].checked = false;
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
				const ids = action.payload.map(user => user.oauth_id);

				const addedFriends = action.payload.filter(user =>
					isFriendFromStatus(user.status)
				);
				draft['master'] = ids;
				draft['friends'].all = addedFriends.map(friend => friend.oauth_id);
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
			// case SET_ONLINE_USERS: {
			// 	state.master.forEach(oauth_id => {
			// 		const isOnline = action.payload.some(
			// 			onlineUser => oauth_id == onlineUser.oauth_id
			// 		);
			// 		let isFriend =
			// 			state.friends.all.length > 0 &&
			// 			state.friends.all.some(friend => oauth_id == friend);

			// 		const listKey = isFriend ? 'friends' : 'nonFriends';
			// 		const listToPushTo = draft[listKey];
			// 		if (isOnline) {
			// 			draft[listKey].online.push(oauth_id);
			// 			return;
			// 		}
			// 		draft[listKey].offline.push(oauth_id);
			// 	});
			// 	break;
			// }

			// can remove now
			// case ADD_ONLINE_USER: {
			// 	let isFriend =
			// 		state.friends.all.length > 0 &&
			// 		state.friends.all.some(friend => action.id == friend);
			// 	const listKey = isFriend ? 'friends' : 'nonFriends';
			// 	const newOfflineUsers = state[listKey].offline.filter(
			// 		oauth_id => oauth_id !== action.id
			// 	);
			// 	draft[listKey].offline = newOfflineUsers;
			// 	const doNotUpdate = draft[listKey].online.some(oauth_id => oauth_id =>
			// 		oauth_id !== action.id
			// 	);
			// 	if (doNotUpdate) break;
			// 	draft[listKey].online.push(action.id);
			// 	break;
			// }
			// case REMOVE_ONLINE_USER: {
			// 	let isFriend =
			// 		state.friends.all.length > 0 &&
			// 		state.friends.all.some(friend => action.id == friend);
			// 	const listKey = isFriend ? 'friends' : 'nonFriends';
			// 	const newOnlineUsers = state[listKey].online.filter(
			// 		oauth_id => oauth_id !== action.id
			// 	);
			// 	draft[listKey].online = newOnlineUsers;
			// 	const doNotUpdate = draft[listKey].online.some(oauth_id => oauth_id =>
			// 		oauth_id !== action.id
			// 	);
			// 	if (doNotUpdate) break;
			// 	draft[listKey].offline.push(action.id);
			// 	break;
			// }
			// return { ...state, ...listOf };
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
