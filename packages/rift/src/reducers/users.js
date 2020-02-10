import { combineReducers } from 'redux';
import {
	GET_ONLINE_USERS,
	SET_ONLINE_USERS,
	ADD_CALL,
	REMOVE_CALL,
	ADD_ONLINE_USER,
	REMOVE_ONLINE_USER
} from '../actions';

export const intialState = {
	online: {
		users: [],
		gotOnlineUsers: false
	}
};

export const online = (state = {}, action) => {
	switch (action.type) {
		case GET_ONLINE_USERS:
			const newState = state;
			return newState;
		case SET_ONLINE_USERS:
			const users = action.payload.map(user => ({
				...user,
				checked: false
			}));
			return { ...state, gotOnlineUsers: true, users };
		case ADD_ONLINE_USER:
			const userPresent = state.users.some(
				user => user.name == action.payload.name
			);
			if (userPresent) return state;
			let usersAdd = [...state.users, { ...action.payload, checked: false }];
			const addedToState = { ...state, users: usersAdd };
			return addedToState;
		case REMOVE_ONLINE_USER:
			let usersRemoved = state.users.filter(
				user => action.payload.name !== user.name
			);
			return { ...state, users: usersRemoved };
		case ADD_CALL:
			let addUsers = state.users.map(({ checked, name }, index) => {
				if (action.index == index) {
					return { name, checked: true };
				}
				return { checked, name };
			});
			return { ...state, users: addUsers };
		case REMOVE_CALL:
			let removeUsers = state.users.map(({ checked, name }, index) => {
				if (action.index == index) {
					return { name, checked: false };
				}
				return { checked, name };
			});
			return { ...state, users: removeUsers };

		default:
			return state;
	}
};

const usersReducer = combineReducers({
	online
});
export default usersReducer;