export const peerAction = (conn_id, method, ...args) => ({
	type: 'PEER_ACTION',
	conn_id,
	payload: {
		method,
		args: args || []
	}
});

export const SEND_CANDIDATE = 'SEND_CANDIDATE';
export const sendCandidate = candidate => ({
	type: SEND_CANDIDATE,
	payload: candidate
});
export const ADD_CANDIDATE = 'ADD_CANDIDATE';
export const CREATE_PEER_CONN = 'CREATE_PEER_CONN';
export const SET_PEER_CONN = 'SET_PEER_CONN';
export const SET_PEER_STARTED = 'SET_PEER_STARTED';
export const SET_PEER_INITIATOR = 'SET_PEER_INITIATOR';
export const createPeerConn = (config = {}) => ({
	type: CREATE_PEER_CONN,
	config
});

export const setPeerConn = conn => ({
	type: SET_PEER_CONN,
	conn
});
export const setPeerStarted = started => ({
	type: SET_PEER_STARTED,
	started
});
export const setPeerInitiator = initiator => ({
	type: SET_PEER_STARTED,
	initiator
});
export const START_CALL = 'START_CALL';
// if user false, send offer from checked (user for quick call mostly)
export const startCall = (type = 'audio', user = {}, stream = false) => ({
	type: START_CALL,
	payload: {
		type,
		id: user.id || false,
		user
	},
	mediaStream: stream
});
export const SEND_OFFER = 'SEND_OFFER';
//probably remove other than user
export const sendOffer = ({ id, user }) => ({
	type: SEND_OFFER,
	// offer: message.desc,
	// constraints: message.constraints,
	user,
	id: id || user?.oauth_id || false
});
export const GOT_MESSAGE = 'GOT_MESSAGE';
export const HANDLERS_SET = 'HANDLERS_SET';

export const SET_CONSTRAINTS = 'SET_CONSTRAINTS';
export const setConstraints = ({ mediaStream, optionalOfferOptions = {} }) => {
	const offerVideo = { offerToReceiveVideo: true, offerToReceiveAudio: true };
	const offerAudio = { offerToReceiveVideo: false, offerToReceiveAudio: true };
	const videoEnabled = mediaStream.video;
	const offerOptions = {
		...offerAudio,
		...(videoEnabled && offerVideo),
		...optionalOfferOptions
	};
	return {
		type: SET_CONSTRAINTS,
		constraints: { mediaStream, offerOptions }
	};
};
export const ADD_CONNECTION = 'ADD_CONNECTION';
export const addConnection = user_id => ({
	type: ADD_CONNECTION,
	id: user_id
});

export const EDIT_CONNECTION = 'EDIT_CONNECTION';
export const editConnection = (user_id, data) => ({
	type: EDIT_CONNECTION,
	payload: data,
	id: user_id
});
export const CALL_ACTIVE = 'CALL_ACTIVE';
export const setCallActive = (user_id, active) => ({
	type: CALL_ACTIVE,
	id: user_id,
	payload: { active }
});
// export const setCallActive = (user_id, active) => ({
// 	type: EDIT_CONNECTION,
// 	id: user_id,
// 	payload: { active }
// });

export const ADD_CALL = 'ADD_CALL';
export const addToCall = user => ({
	type: ADD_CALL,
	payload: { user }
});

export const REMOVE_CALL = 'REMOVE_CALL';
export const removeFromCall = user => ({
	type: REMOVE_CALL,
	payload: { user }
});

export const SET_STREAM = 'SET_STREAM';
export const setStream = stream => ({
	type: SET_STREAM,
	payload: stream
});

export const CALL_INCOMING = 'CALL_INCOMING';
export const setIncomingCall = from => ({
	type: CALL_INCOMING,
	payload: from,
	id: from.oauth_id
	// socket_id:
});

export const ANSWER_INCOMING = 'ANSWER_INCOMING';
export const answer = (answered, from) => ({
	type: ANSWER_INCOMING,
	payload: answered || true,
	id: from.oauth_id
});

export const END_CALL = 'END_CALL';
export const endCall = id => ({
	type: END_CALL,
	id
});
