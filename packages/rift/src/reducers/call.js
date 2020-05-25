import { combineReducers } from 'redux';
import {
	ADD_CANDIDATE,
	ADD_CONNECTION,
	EDIT_CONNECTION,
	CALL_ACTIVE,
	CREATE_PEER_CONN,
	SET_PEER_CONN,
	SET_CONSTRAINTS,
	HANDLERS_SET,
	SET_PEER_STARTED,
	SET_PEER_INITIATOR,
	SET_REMOTE,
	SET_STREAM,
	INCOMING_CONNECTION,
	ANSWER_INCOMING,
	END_CALL
} from '@actions';

export const initialState = {
	// TODO: incoming change to connections
	peerStore: {
		conn: null,
		created: false,
		config: {},
		handlersAttached: false,
		isStarted: false,
		isInitiator: false,
		stream: null,
		incomingCall: { received: false, from: null, answered: null, pending: false },
		active: false
		// incomingCall: {
		// 	received: true,
		// 	from: { id: 'bullshit', username: 'robertmozeika' },
		// 	answered: false,
		// 	pending: true
		// }
	},
	connections: {
		// 'google-oauth2|100323185772603201403': {
		// 	id: 'google-oauth2|100323185772603201403',
		// 	active: false,
		// 	incoming: true
		// },
		// 'mock-auth0|371415858674846168435': {
		// 	id: 'mock-auth0|371415858674846168435',
		// 	active: false,
		// 	incoming: true
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
		case INCOMING_CONNECTION:
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
		case SET_STREAM:
			return { ...state, stream: action.payload };
		// case INCOMING_CONNECTION:
		// 	return Object.assign({}, state, {
		// 		incomingCall: incomingCall(state.incomingCall, action)
		// 	});
		// case ANSWER_INCOMING:
		// 	return Object.assign({}, state, {
		// 		incomingCall: incomingCall(state.incomingCall, action)
		// 	});

		// return {
		// 	...state,
		// 	incomingCall: {
		// 		...state.incomingCall,
		// 		received: true,
		// 		from: action.payload,
		// 		answered: false
		// 	}
		// };
		//
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
const connection = (state = {}, action) => {
	switch (action.type) {
		case ADD_CONNECTION: {
			return {
				id: action.id,
				// status: 'started',
				active: false,
				incoming: false,
				constraints: action.constraints
			};
		}
		case CALL_ACTIVE:
		case EDIT_CONNECTION: {
			return {
				...state,
				...action.payload
			};
		}
		case INCOMING_CONNECTION: {
			return {
				...state,
				id: action.id,
				active: false,
				incoming: true,
				constraints: action.constraints
			};
		}
		case ANSWER_INCOMING: {
			return {
				...state,
				id: action.id,
				active: true,
				incoming: true
			};
		}
		default:
			return state;
	}
};
export const connections = (state = {}, action) => {
	switch (action.type) {
		case ADD_CONNECTION:
		case EDIT_CONNECTION:
		case CALL_ACTIVE:
		case INCOMING_CONNECTION:
		case ANSWER_INCOMING:
			return {
				...state,
				[action.id]: connection(state[action.id], action)
			};
		// case CALL_ACTIVE: {
		// 	const { user_id, active } = action.payload;
		// 	return Object.assign({}, state, { active: action.payload });
		// }
		// case INCOMING_CONNECTION: {
		// 	return {
		// 		...state,
		// 		[action.id]: connection(state[action.id], action)
		// 	};
		// }
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
	constraints,
	connections
	// incoming
});
export default callReducer;
