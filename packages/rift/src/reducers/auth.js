import { combineReducers } from 'redux';
import { AUTH } from '../actions';
const { LOGIN } = AUTH;

const createReducer = (initialState, handlers) => {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	};
};

const authReducer = createReducer(
	{},
	{
		[LOGIN.SUCCESS]: (authState, action) => {
			const { src, username } = action.payload;
			const { picture, displayName } = src;
			return {
				user: { picture, username, displayName },
				loggedIn: true,
				checked: true
			};
		},
		[LOGIN.REQUEST]: (authState, action) => {
			return { user: {}, loggedIn: false, checked: true };
		}
	}
);
export default authReducer;
