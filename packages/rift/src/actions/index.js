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
export const SEND_OFFER = 'SEND_OFFER';
export const sendOffer = message => ({
	type: SEND_OFFER,
	offer: message.desc,
	constraints: message.constraints
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
export const ADD_CALL = 'ADD_CALL';
export const addToCall = (index, user) => ({
	type: ADD_CALL,
	payload: { user, index }
});

export const REMOVE_CALL = 'REMOVE_CALL';
export const removeFromCall = (index, user) => ({
	type: REMOVE_CALL,
	payload: { user, index }
});
export const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
export const REMOVE_ONLINE_USER = 'REMOVE_ONLINE_USER';
export const addOnlineUser = user => ({
	type: ADD_ONLINE_USER,
	payload: user
});
export const removeOnlineUser = user => ({
	type: REMOVE_ONLINE_USER,
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
	payload: from
});

export const ANSWER_INCOMING = 'ANSWER_INCOMING';
export const answer = answered => ({
	type: ANSWER_INCOMING,
	payload: answered || true
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
