import { combineReducers } from 'redux';
import {
	AUTH,
	UPDATE_USERNAME_SUCCESS,
	UPDATE_USERNAME_FAILURE
} from '@actions';
const { LOGIN } = AUTH;
export const initialState = {
	loggedIn: false,
	user: {},
	checked: false,
	alert: null
};
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
			const { src, username, usingTempUsername, oauth_id, id } = action.payload;
			const gravatar = action.payload.gravatar || src?.gravatar?.uri;
			// const { picture, displayName, ...restSrc } = src;
			// if (usingTempUsername)
			return {
				user: {
					id,
					// picture,
					username,
					// displayName,
					usingTempUsername,
					oauth_id,
					src,
					gravatar
				},
				loggedIn: true,
				checked: true,
				alert: usingTempUsername
					? 'Username already taken, change username here'
					: null
			};
		},
		[LOGIN.FAILURE]: (authState, action) => {
			const { error } = action;
			return {
				...authState,
				alert: error
			};
		},
		[LOGIN.REQUEST]: (authState, action) => {
			return { user: {}, loggedIn: false, checked: true };
		},
		[UPDATE_USERNAME_SUCCESS]: (authState, action) => {
			// success alert?
			return {
				...authState,
				alert: null,
				user: { ...authState.user, username: action.payload }
			};
		},
		[UPDATE_USERNAME_FAILURE]: (authState, action) => {
			return {
				...authState,
				alert: `Username "${action.payload}" is already taken, try a different username`
			};
		}
	}
);
export default authReducer;
