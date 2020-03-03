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
	online: {
		users: [],
		gotOnlineUsers: false
	},
	friends: [],
	byId: {},
	allIds: []
};
const onlineUsers = (state, action) => {};
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
				if (action.index == index) {
					return { username, checked: true };
				}
				return { checked, username };
			});
			return { ...state, users: addUsers };
		case REMOVE_CALL:
			let removeUsers = state.users.map(({ checked, username }, index) => {
				if (action.index == index) {
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
			return [...state, ...action.payload];
		default:
			return state;
	}
};
export const queued = (state = {}, action) => {
	switch (action.type) {
		default:
			return state;
	}
};
export const list = (state = {}, action) => {
	switch (action.type) {
		case SET_USERS:
			const users = action.payload.map(user => {
				return {
					...user,
					isFriend: false,
					online: false
				};
			});
			return [...action.payload];
		default:
			return state;
	}
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
			case SET_ONLINE_USERS:
				console.log(state); //remove
				action.payload.forEach(user => {
					const { username } = user;
					if (!draft[username]) return;
					draft[username].online = true;
				});
				break;
			case ADD_ONLINE_USER:
				debugger;
				const { usernameAddOnline } = action.payload;
				if (!draft[usernameAddOnline]) return state;
				draft[usernameAddOnline].online = true;
				break;
			case REMOVE_ONLINE_USER:
				const { usernameRemoveOnline } = action.payload;
				if (!draft[usernameRemoveOnline]) return state;
				draft[usernameRemoveOnline].online = true;
				break;
			default:
				return draft;
		}
	});
	console.log(resultProduce);

	return resultProduce;
};
// export const byId = produce((draft, action) => {
// 		switch (action.type) {
// 			case SET_USERS:
// 				const users = action.payload.forEach(user => {
// 					draft[user.username] = {
// 						...user,
// 						isFriend: false,
// 						online: false
// 					};
// 				}, {});
// 				debugger;
// 				break;
// 			case SET_ONLINE_USERS:
// 				console.log(state); //remove
// 				debugger; //remove
// 				action.payload.forEach(user => {
// 					const { username } = user;
// 					if (!draft[username]) return;
// 					draft[username].online = true;
// 				});
// 				debugger; //remove
// 				break;
// 			default:
// 				return draft;
// 		}
// 	});

export const allIds = (state = [], action) => {
	switch (action.type) {
		case SET_USERS:
			const ids = action.payload.map(user => user.username);
			return [...ids];
		default:
			return state;
	}
};

const usersReducer = combineReducers({
	online,
	friends,
	// queued,
	// list,
	byId,
	allIds
});
export default usersReducer;
