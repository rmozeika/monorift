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
	REMOVE_ONLINE_USER
} from '../actions';

export const initialState = {
	status: {
		gotOnline: false,
		gotFriends: false
	},
	online: {
		users: [],
		gotOnlineUsers: false
	},
	friends: [],
	byId: {},
	allIds: {
		master: [],
		online: [],
		offline: []
	},
	queued: []
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
					...action.payload.user,
					orderedUserIndex: action.payload.index
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
			case SET_USERS:
				const users = action.payload.forEach(user => {
					draft[user.username] = {
						...user,
						isFriend: false,
						online: false,
						checked: false
					};
				}, {});
				break;
			case SET_FRIENDS:
				action.payload.forEach(user => {
					const { username } = user;
					if (!draft[username]) return;
					draft[username].isFriend = true;
				});
				break;
			case SET_ONLINE_USERS:
				console.log(state); //remove
				action.payload.forEach(user => {
					const { username } = user;
					if (!draft[username]) return;
					draft[username].online = true;
				});
				break;
			case ADD_ONLINE_USER:
				const { usernameAddOnline } = action.payload;
				if (!draft[usernameAddOnline]) return state;
				draft[usernameAddOnline].online = true;
				break;
			case REMOVE_ONLINE_USER:
				const { usernameRemoveOnline } = action.payload;
				if (!draft[usernameRemoveOnline]) return state;
				draft[usernameRemoveOnline].online = true;
				break;
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
	console.log(resultProduce);

	return resultProduce;
};

export const allIds = (state = {}, action) => {
	switch (action.type) {
		case SET_USERS:
			const ids = action.payload.map(user => user.username);
			return { master: [...ids] };
		// CHANGE THIS! MERGE THIS WITH ONLINE
		case SET_ONLINE_USERS:
			// action.payload.reduce((acc, onlineUser => {

			// }));
			const online = [];
			const offline = [];
			state.master.forEach(username => {
				const isOnline = action.payload.some(
					onlineUser => username == onlineUser.username
				);
				if (isOnline) {
					online.push(username);
					return;
				}
				offline.push(username);
			});
			return { ...state, online, offline };
		default:
			return state;
	}
};
// orderedUsers()

const usersReducer = combineReducers({
	status,
	online,
	friends,
	queued,
	byId,
	allIds
});
export default usersReducer;
