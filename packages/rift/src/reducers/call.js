import { combineReducers } from 'redux';
import {
	ADD_CANDIDATE,
	CREATE_PEER_CONN,
	SET_PEER_CONN,
	SET_CONSTRAINTS,
	HANDLERS_SET,
	SET_PEER_STARTED,
	SET_PEER_INITIATOR,
	SET_REMOTE
} from '../actions';
export const initialState = {
	peerStore: {
		conn: null,
		created: false,
		config: {},
		handlersAttached: false,
		isStarted: false,
		isInitiator: false,
		remoteSet: false
	},
	candidate: {},
	constraints: {
		mediaStream: { audio: true, video: false },
		offerOptions: { offerToReceiveVideo: true, offerToReceiveAudio: true }
	}
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

export const peerStore = (state = [], action = {}) => {
	switch (action.type) {
		case CREATE_PEER_CONN:
			return { ...state, created: 0.5, config: action.config || {} };
		case SET_PEER_CONN:
			return { ...state, created: true, conn: action.conn };
		case HANDLERS_SET:
			return { ...state, handlersAttached: true };
		case SET_PEER_STARTED:
			return { ...state, isStarted: action.started };
		case SET_PEER_INITIATOR:
			return { ...state, isInitiator: action.initiator };
		case SET_REMOTE:
			return { ...state, remoteSet: action.remoteSet };
		default:
			return state;
	}
};
export const constraints = (state = {}, action) => {
	switch (action.type) {
		case SET_CONSTRAINTS:
			const { mediaStream, offerOptions } = action.constraints;
			return { ...state, mediaStream, offerOptions };
		default:
			return state;
	}
};
const callReducer = combineReducers({
	candidate,
	peerStore,
	constraints
});
export default callReducer;
