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

export const START_CALL = 'START_CALL';
// if user false, send offer from checked (user for quick call mostly)
export const startCall = ({
	type = 'audio',
	user = {},
	stream = false,
	dimensions = {}
}) => ({
	type: START_CALL,
	id: user.id || false,
	payload: {
		type,
		dimensions, // for video
		mediaStream: stream,
		user
	}
});
export const SEND_OFFER = 'SEND_OFFER';
//probably remove other than user
export const sendOffer = ({ id, user, offerOptions, constraints }) => {
	const offerVideo = { offerToReceiveVideo: true, offerToReceiveAudio: true };
	const offerAudio = { offerToReceiveVideo: false, offerToReceiveAudio: true };
	const videoEnabled = constraints.video;
	const derivedOfferOptions = {
		...offerAudio,
		...(videoEnabled && offerVideo),
		...offerOptions
	};
	return {
		type: SEND_OFFER,
		constraints,
		offerOptions: derivedOfferOptions,
		user,
		id: id || user?.oauth_id || false
	};
};
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
export const addConnection = (user_id, constraints) => ({
	type: ADD_CONNECTION,
	id: user_id,
	constraints
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

export const INCOMING_CONNECTION = 'INCOMING_CONNECTION';
export const setIncomingConnection = (id, constraints) => ({
	type: INCOMING_CONNECTION,
	// payload: from,
	id,
	constraints
	// socket_id:
});

export const ANSWER_INCOMING = 'ANSWER_INCOMING';
export const answer = (id, from, answered = true) => ({
	type: ANSWER_INCOMING,
	payload: answered || true,
	id: id || from.oauth_id || from.id,
	from
});

export const END_CALL = 'END_CALL';
export const endCall = id => ({
	type: END_CALL,
	id
});
