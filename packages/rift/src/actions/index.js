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
// export const getConfig = () => dispatch => {
//   // shop.getConfig(config => {
//   //   dispatch(setConfig(config));
//   // });
//     dispatch(setConfig({ needsToComeFrom: 'somewhere' }));
// };

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
// export const REPO = createRequestTypes('REPO');
// export const STARRED = createRequestTypes('STARRED');
// export const STARGAZERS = createRequestTypes('STARGAZERS');
export const SEND_CANDIDATE = 'SEND_CANDIDATE';
export const sendCandidate = candidate => ({
	type: SEND_CANDIDATE,
	payload: candidate
});
export const ADD_CANDIDATE = 'ADD_CANDIDATE';
export const CREATE_PEER_CONN = 'CREATE_PEER_CONN';
export const SET_PEER_CONN = 'SET_PEER_CONN';
export const createPeerConn = (config = {}) => ({
	type: CREATE_PEER_CONN,
	config
});

export const setPeerConn = conn => ({
	type: SET_PEER_CONN,
	conn
});

export const SEND_OFFER = 'SEND_OFFER';
export const sendOffer = message => ({
	type: SEND_OFFER,
	offer: message.desc,
	constraints: message.mediaStreamConstraints
});
export const GOT_MESSAGE = 'GOT_MESSAGE';
export const HANDLERS_SET = 'HANDLERS_SET';

export const SET_CONSTRAINTS = 'SET_CONSTRAINTS';
export const setConstraints = ({ mediaStream }) => ({
	type: SET_CONSTRAINTS,
	constraints: { mediaStream }
});

// import { TiffanyActions } from '../reducers/tiffany';
// export const tiffany = TiffanyActions;
