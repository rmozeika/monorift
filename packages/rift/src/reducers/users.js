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
	UPDATE_USER
} from '@actions';
const isFriendFromStatus = friendStatus => {
	return ['A', 'P', 'S'].some(key => key == friendStatus);
};
export const initialState = {
	status: {
		gotOnline: false,
		gotFriends: false
	},
	online: {
		users: [],
		gotOnlineUsers: false
	},
	// remove this
	friends: [],
	byId: {},
	allIds: {
		master: [],
		friends: {
			all: [],
			online: [],
			offline: []
		},
		nonFriends: {
			online: [],
			offline: []
		}
	},
	queued: [],
	search: { filter: '' }
};
const onlineUsers = (state, action) => {};
export const status = (state = {}, action) => {
	switch (action.type) {
		case SET_ONLINE_USERS:
			return { ...state, gotOnline: true };
		case SET_FRIENDS:
			return { ...state, gotFriends: true };
		default:
			return state;
	}
};
export const online = (state = {}, action) => {
	switch (action.type) {
		case SET_ONLINE_USERS:
			const users = action.payload.map(user => ({
				...user,
				checked: false
			}));
			return { ...state, gotOnlineUsers: true, users };
		case ADD_ONLINE_USER:
			const userPresent = state.users.some(
				user => user.username == action.payload.username
			);
			if (userPresent) return state;
			let usersAdd = [...state.users, { ...action.payload, checked: false }];
			const addedToState = { ...state, users: usersAdd };
			return addedToState;
		case REMOVE_ONLINE_USER:
			let usersRemoved = state.users.filter(
				user => action.payload.username !== user.username
			);
			return { ...state, users: usersRemoved };
		case ADD_CALL:
			let addUsers = state.users.map(({ checked, username }, index) => {
				if (action.payload.index == index) {
					return { username, checked: true };
				}
				return { checked, username };
			});
			return { ...state, users: addUsers };
		case REMOVE_CALL:
			let removeUsers = state.users.map(({ checked, username }, index) => {
				if (action.payload.index == index) {
					return { username, checked: false };
				}
				return { checked, username };
			});
			return { ...state, users: removeUsers };

		default:
			return state;
	}
};
export const friends = (state = {}, action) => {
	switch (action.type) {
		case SET_FRIENDS:
			return [...state, action.payload];
		default:
			return state;
	}
};
export const queued = (state = [], action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case ADD_CALL:
				draft.push({
					...action.payload.user
				});
				break;
			case REMOVE_CALL:
				draft.filter(user => user.username !== action.payload.user.username);
				break;
			default:
				return draft;
		}
	});
	return resultProduce;
};

export const byId = (state = {}, action) => {
	const resultProduce = produce(state, draft => {
		switch (action.type) {
			case SET_USERS: {
				const users = action.payload.forEach(({ status, ...user }) => {
					draft[user.username] = {
						...user,
						isFriend: status == 'P' || status == 'A' || status == 'S',
						friendStatus: status,
						online: false,
						checked: false
					};
				}, {});
				break;
			}
			case UPDATE_USER: {
				const { username, data } = action.payload;
				const entries = Object.entries(data);
				entries.forEach(([key, value]) => {
					draft[username][key] = value;
				});
				break;
			}
			case SET_ONLINE_USERS:
				action.payload.forEach(user => {
					const { username } = user;
					if (!draft[username]) return;
					draft[username].online = true;
				});
				break;
			case ADD_ONLINE_USER: {
				const { username } = action.payload;
				draft[username].online = true;
				break;
			}
			case REMOVE_ONLINE_USER: {
				const { username } = action.payload;
				draft[username].online = true;
				break;
			}
			case ADD_CALL:
				draft[action.payload.user.username].checked = true;
				break;
			case REMOVE_CALL:
				draft[action.payload.user.username].checked = false;
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
				const ids = action.payload.map(user => user.username);

				const addedFriends = action.payload.filter(user =>
					isFriendFromStatus(user.status)
				);
				draft['master'] = ids;
				draft['friends'].all = addedFriends.map(friend => friend.username);
				break;
				// CHANGE THIS! MERGE THIS WITH ONLIN
			}
			case SET_ONLINE_USERS: {
				state.master.forEach(username => {
					const isOnline = action.payload.some(
						onlineUser => username == onlineUser.username
					);
					let isFriend =
						state.friends.all.length > 0 &&
						state.friends.all.some(friend => username == friend);

					const listKey = isFriend ? 'friends' : 'nonFriends';
					const listToPushTo = draft[listKey];
					if (isOnline) {
						draft[listKey].online.push(username);
						return;
					}
					draft[listKey].offline.push(username);
				});
				break;
			}
			case ADD_ONLINE_USER: {
				let isFriend =
					state.friends.all.length > 0 &&
					state.friends.all.some(friend => action.payload.username == friend);
				const listKey = isFriend ? 'friends' : 'nonFriends';
				const newOfflineUsers = state[listKey].offline.filter(
					username => username !== action.payload.username
				);
				draft[listKey].offline = newOfflineUsers;
				draft[listKey].online.push(action.payload.username);
				break;
			}
			case REMOVE_ONLINE_USER: {
				let isFriend =
					state.friends.all.length > 0 &&
					state.friends.all.some(friend => action.payload.username == friend);
				const listKey = isFriend ? 'friends' : 'nonFriends';
				const newOnlineUsers = state[listKey].online.filter(
					username => username !== action.payload.username
				);
				draft[listKey].online = newOnlineUsers;
				draft[listKey].offline.push(action.payload.username);
				break;
			}
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
	online,
	friends,
	queued,
	byId,
	allIds,
	search
});
export default usersReducer;
