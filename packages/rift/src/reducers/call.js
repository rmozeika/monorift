import { combineReducers } from 'redux';
import {
	ADD_CANDIDATE,
	CREATE_PEER_CONN,
	SET_PEER_CONN,
  SET_CONSTRAINTS,
  HANDLERS_SET
} from '../actions';

const createReducer = (initialState, handlers) => {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	};
};
export const candidate = (state = {}, action = {}) => {
	switch (action.type) {
		case ADD_CANDIDATE:
			if (!state.main) {
				return { ...state, main: action.candidate, rest: [] };
			}
			return { ...state, rest: [...state.rest, action.candidate] };
		default:
			return state;
	}
};

export const peerConn = (state = [], action = {}) => {
	switch (action.type) {
		case CREATE_PEER_CONN:
			return { ...state, created: 0.5, config: action.config || {} };
		case SET_PEER_CONN:
      return { ...state, created: true, conn: action.conn };
    case HANDLERS_SET:
      return { ...state, handlersAttached: true };
		default:
			return state;
	}
};
export const constraints = (state = {}, action) => {
	switch (action.type) {
		case SET_CONSTRAINTS:
			return { ...state, mediaStream: action.mediaStream };
		// case GET_CONSTRAINTS:
		//     return { ...state, created: true, conn: action.conn };
		default:
			return state;
	}
};
const callReducer = combineReducers({
	candidate,
	peerConn,
	constraints
});
export default callReducer;
