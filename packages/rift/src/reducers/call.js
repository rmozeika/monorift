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
	INCOMING_CONNECTION,
	ANSWER_INCOMING,
	END_CALL
} from '@actions';
import { update } from 'lodash';

export const initialState = {
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
	// TODO: incoming change to connections
	// peerStore: {
	// 	// conn: null,
	// 	// created: false,
	// 	// config: {},
	// 	// handlersAttached: false,
	// 	// isStarted: false,
	// 	// isInitiator: false,
	// 	// stream: null,
	// 	// incomingCall: { received: false, from: null, answered: null, pending: false },
	// 	// active: false
	// 	// incomingCall: {
	// 	// 	received: true,
	// 	// 	from: { id: 'bullshit', username: 'robertmozeika' },
	// 	// 	answered: false,
	// 	// 	pending: true
	// 	// }
	// },

	candidate: {},
	calls: {

	}
	// constraints: {
	// 	mediaStream: { audio: true, video: false },
	// 	offerOptions: { offerToReceiveVideo: true, offerToReceiveAudio: true }
	// }
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

// // TODO: REMOVE
// export const incomingCall = (state = {}, action = {}) => {
// 	switch (action.type) {
// 		case INCOMING_CONNECTION:
// 			return {
// 				...state,
// 				received: true,
// 				from: action.payload,
// 				answered: false,
// 				pending: true // maybe redundant but prevents logic when setting answer button
// 			};
// 		case ANSWER_INCOMING:
// 			return {
// 				...state,
// 				answered: action.payload,
// 				pending: false
// 			};
// 		default:
// 			return state;
// 	}
// };
const calls = (state = {}, action) => {
	switch (action.type) {
		case INCOMING_CONNECTION:
		case ADD_CONNECTION: {
			const { opts,  id } = action;
			const { call_id = false, offer_sent = false, constraints } = opts;
			if (!call_id) break;
			const call = state[call_id] || { constraints, connected: false };
			//const userExists = call.users.some(user => user == id);
			// if (!userExists) {
			// 	call.users = call.users.concat([id]);
			// }
			return { ...state, [call_id]: call };
		}
		default: {
			return state;
		}
	}
};
const connection = (state = {}, action) => {
	switch (action.type) {
		case ADD_CONNECTION: {
			const { opts } = action;
			const { call_id, offer_sent, constraints } = opts;
			return {
				id: action.id,
				// status: 'started',
				active: false,
				incoming: false,
				constraints,
				call_id,
				offer_sent
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
			const { opts, id } = action;
			const { call_id, offer_sent,  constraints } = opts;
			return {
				...state,
				id,
				active: false,
				incoming: true,
				constraints,
				call_id,
				offer_sent

			};
		}
		case ANSWER_INCOMING: {
			return {
				...state,
				//id: action.id,
				active: true,
				incoming: false
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
		case INCOMING_CONNECTION: {
			return {
				...state,
				[action.id]: connection(state[action.id], action)
			};
		}
		case ANSWER_INCOMING: {
			const { users } = action;
			if (users) {
				users.forEach(({id}) => {
					state[id] = connection(state[id], action);
				});
				return state;
			}
			return {
				...state,
				[action.id]: connection(state[action.id], action)
			};
			// let toUpdate;
			// if (state[action.id]) {
			// 	toUpdate.push(action.id)
			// } else {
			// 	toUpdate = state.filter((conn => action.id == conn.call_id));
			// }
			

		}
			
			
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
// export const constraints = (state = {}, action) => {
// 	switch (action.type) {
// 		case SET_CONSTRAINTS:
// 			const { mediaStream, offerOptions } = action.constraints;
// 			return { ...state, mediaStream, offerOptions };
// 		default:
// 			return state;
// 	}
// };
const callReducer = combineReducers({
	candidate,
	// constraints,
	connections,
	calls
});
export default callReducer;
