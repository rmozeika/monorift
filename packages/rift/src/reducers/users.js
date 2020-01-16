import { combineReducers } from 'redux';
import { GET_ONLINE_USERS, SET_ONLINE_USERS } from '../actions';

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
			return { ...state, gotOnlineUsers: true, users: action.payload };
		default:
			return state;
	}
};

const usersReducer = combineReducers({
	online
});
export default usersReducer;
