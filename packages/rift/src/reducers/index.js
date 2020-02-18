import config, * as fromConfig from './config';
import code, * as fromCode from './code';
import auth, * as fromAuth from './auth';
import callReducer, * as fromCall from './call';
import usersReducer, * as fromUsers from './users';
import viewReducer, * as fromView from './view';
debugger;

import { combineReducers } from 'redux';
export const initialState = {
	config: {},
	code: { file1: 'beforeafter' },
	auth: { loggedIn: false, user: {} },
	// call: {
	//   peerStore: {
	//     conn: null, created: false, config: {}, handlersAttached: false
	//   },
	//   candidate: {},
	//   constraints: {
	//     mediaStream: { audio: true, video: false }
	//   }
	// },
	call: { ...fromCall.initialState },
	users: { ...fromUsers.initialState },
	view: { ...fromView.initialState }
};

export default combineReducers({
	config,
	code,
	auth,
	call: callReducer,
	users: usersReducer,
	view: viewReducer
});

export const createReducer = (initialState, handlers) => {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	};
};

export const updateItemInArray = (array, itemId, updateItemCallback) => {
	const updatedItems = array.map(item => {
		if (item.id !== itemId) {
			return item;
		}

		const updatedItem = updateItemCallback(item);
		return updatedItem;
	});

	return updatedItems;
};
