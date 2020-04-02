import * as types from './types';

export const ActionTypes = types;
export const setConfig = config => ({
	type: types.setConfig,
	config
});

export function loadData() {
	return { type: types.loadData };
}

export function loadDataSuccess(data) {
	return {
		type: types.loadDataSuccess,
		data
	};
}

export const getConfig = () => ({
	type: types.getConfig
});

export const initConfig = () => ({
	type: types.initConfig
});

export const getCode = () => ({
	type: types.GET_CODE
});

export const setCode = code => ({
	type: types.SET_CODE,
	code
});

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
	return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`;
		return acc;
	}, {});
}

export const LOGIN = createRequestTypes('LOGIN');
export const AUTH = { LOGIN: { ...LOGIN } };
export const CODE = { ...createRequestTypes('CODE'), ...types.code };
export const REPO = createRequestTypes('REPO');
export const code = {
	request: login => action(CODE[REQUEST], { login }),
	success: (login, response) => action(CODE[SUCCESS], { login, response }),
	failure: (login, error) => action(CODE[FAILURE], { login, error })
};
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
export const startCall = (type = 'audio', oauth_id = false) => ({
	type: START_CALL,
	payload: {
		type,
		id: oauth_id,
		user
	}
});
export const SEND_OFFER = 'SEND_OFFER';
//probably remove other than user
export const sendOffer = ({ oauth_id = false }) => ({
	type: SEND_OFFER,
	// offer: message.desc,
	// constraints: message.constraints,
	id: oauth_id
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

export const SET_REMOTE = 'SET_REMOTE';
export const setRemote = (remoteIsSet = true) => ({
	type: SET_REMOTE,
	remoteSet: remoteIsSet
});

export const FETCH_ONLINE_USERS = 'FETCH_ONLINE_USERS';
export const SET_ONLINE_USERS = 'SET_ONLINE_USERS';
export const FETCH_USERS = 'FETCH_USERS';
export const fetchUsers = () => ({
	type: FETCH_USERS
});
export const SET_USERS = 'SET_USERS';
export const setUsers = users => ({
	type: SET_USERS,
	payload: users
});

export const UPDATE_USER = 'UPDATE_USER';
export const updateUser = (oauth_id, data) => ({
	type: UPDATE_USER,
	payload: {
		oauth_id,
		data
	}
});
export const fetchOnlineUsers = () => ({
	type: FETCH_ONLINE_USERS
});
export const setOnlineUsers = users => ({
	type: SET_ONLINE_USERS,
	payload: users
});

export const FETCH_FRIENDS = 'FETCH_FRIENDS';
export const fetchFriends = () => ({
	type: FETCH_FRIENDS
});
export const SET_FRIENDS = 'SET_FRIENDS';
export const setFriends = friends => ({
	type: SET_FRIENDS,
	payload: friends
});
export const ADD_FRIEND = 'ADD_FRIEND';
export const addFriend = friend => ({
	type: ADD_FRIEND,
	payload: friend
});

export const RESPOND_FRIEND_REQUEST = 'RESPOND_FRIEND_REQUEST';
export const respondFriendRequest = (friend, didAccept) => ({
	type: RESPOND_FRIEND_REQUEST,
	payload: { friend, didAccept }
});
export const REMOVE_FRIEND = 'ADD_FRIEND';
export const removeFriend = friend => ({
	type: REMOVE_FRIEND,
	payload: friend
});
export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export const updateUsername = username => ({
	type: UPDATE_USERNAME,
	payload: username
});

export const UPDATE_USERNAME_SUCCESS = 'UPDATE_USERNAME_SUCCESS';
export const updateUsernameSuccess = username => ({
	type: UPDATE_USERNAME_SUCCESS,
	payload: username
});

export const UPDATE_USERNAME_FAILURE = 'UPDATE_USERNAME_FAILURE';
export const updateUsernameFailure = username => ({
	type: UPDATE_USERNAME_FAILURE,
	payload: username
});

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
export const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
export const REMOVE_ONLINE_USER = 'REMOVE_ONLINE_USER';
export const addOnlineUser = user => ({
	type: ADD_ONLINE_USER,
	id: user.oauth_id,
	payload: user
});
export const removeOnlineUser = user => ({
	type: REMOVE_ONLINE_USER,
	id: user.oauth_id,
	payload: user
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

export const SET_TAB_VIEW = 'SET_TAB_VIEW';
export const setTabView = index => ({
	type: SET_TAB_VIEW,
	payload: index
});
export const SET_IS_MOBILE = 'SET_IS_MOBILE';

export const setIsMobile = isMobile => ({
	type: SET_IS_MOBILE,
	payload: isMobile
});

export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER';
export const search = input => ({
	type: SET_SEARCH_FILTER,
	payload: input
});

export const peerAction = (method, ...args) => ({
	type: 'PEER_ACTION',
	payload: {
		method,
		args: args || []
	}
});
