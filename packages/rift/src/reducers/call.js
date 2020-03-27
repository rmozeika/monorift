import { combineReducers } from 'redux';
import {
	ADD_CANDIDATE,
	CREATE_PEER_CONN,
	SET_PEER_CONN,
	SET_CONSTRAINTS,
	HANDLERS_SET,
	SET_PEER_STARTED,
	SET_PEER_INITIATOR,
	SET_REMOTE,
	SET_STREAM,
	CALL_INCOMING,
	ANSWER_INCOMING
} from '@actions';
export const initialState = {
	peerStore: {
		conn: null,
		created: false,
		config: {},
		handlersAttached: false,
		isStarted: false,
		isInitiator: false,
		remoteSet: false,
		stream: null,
		incomingCall: { received: false, from: null, answered: null, pending: false }
		// incomingCall: {
		// 	received: true,
		// 	from: { id: 'bullshit', username: 'robertmozeika' },
		// 	answered: false,
		// 	pending: true
		// }
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
export const incomingCall = (state = {}, action = {}) => {
	switch (action.type) {
		case CALL_INCOMING:
			return {
				...state,
				received: true,
				from: action.payload,
				answered: false,
				pending: true // maybe redundant but prevents logic when setting answer button
			};
		case ANSWER_INCOMING:
			return {
				...state,
				answered: action.payload,
				pending: false
			};

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
		case SET_STREAM:
			return { ...state, stream: action.payload };
		case CALL_INCOMING:
			return Object.assign({}, state, {
				incomingCall: incomingCall(state.incomingCall, action)
			});
		// return {
		// 	...state,
		// 	incomingCall: {
		// 		...state.incomingCall,
		// 		received: true,
		// 		from: action.payload,
		// 		answered: false
		// 	}
		// };
		case ANSWER_INCOMING:
			return Object.assign({}, state, {
				incomingCall: incomingCall(state.incomingCall, action)
			});
		// return {
		// 	...state,
		// 	incomingCall: {
		// 		...state.incomingCall,
		// 		answered: action.payload
		// 	}
		// };
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
	// incoming
});
export default callReducer;
