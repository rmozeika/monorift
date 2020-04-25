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

export const CREATE_GUEST = 'CREATE_GUEST';
export const createGuest = (username, password) => ({
	type: CREATE_GUEST,
	payload: {
		username,
		password
	}
});

export const SIMPLE_LOGIN = 'SIMPLE_LOGIN';
export const simpleLogin = (username, password) => ({
	type: SIMPLE_LOGIN,
	payload: {
		username,
		password
	}
});

export const CREATE_GUEST_FAILURE = 'CREATE_GUEST_FAILURE';
export const createGuestFailure = message => ({
	type: CREATE_GUEST_FAILURE,
	message
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
