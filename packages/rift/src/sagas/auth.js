/* global fetch */

import {
	all,
	call,
	delay,
	put,
	take,
	takeLatest,
	actionChannel
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { originLink } from '@core/utils';
import 'isomorphic-unfetch';

import * as Actions from '@actions';
import { get, post } from '@core/api';

const { AUTH } = Actions;
import io from 'socket.io-client';

const socketServerURL = originLink();
let socket;

const connect = () => {
	socket = io(socketServerURL);
	return new Promise(resolve => {
		socket.on('connect', () => {
			resolve(socket);
		});
	});
};

const createSocketChannel = socket =>
	eventChannel(emit => {
		const handler = data => {
			emit(data);
		};
		socket.on('login', handler);
		socket.emit('check_auth', data => {
			emit(data);
		});
		return () => {
			socket.off('login', handler);
			socket.disconnect();
		};
	});

function* initAuthSaga() {
	const socket = yield call(connect);
	socket.send('hi');
	const socketChannel = yield call(createSocketChannel, socket);
	while (true) {
		const { user } = yield take(socketChannel);
		console.log('GOT MESSAGE, AUTH', user);

		try {
			if (user?.username) {
				yield put({ type: AUTH.LOGIN.SUCCESS, payload: user });
			} else {
				yield put({ type: AUTH.LOGIN.REQUEST, payload: user });
			}
		} catch (e) {
			yield put({ type: AUTH.LOGIN.FAILURE, payload: user });
		}
	}
}
function* onLoginSaga() {
	console.log('on log in success');
	yield put(Actions.fetchFriends());
	console.log('fetching friends');
}

function* createGuestSaga(action) {
	try {
		const { username, password } = action.payload;
		const origin = originLink('createGuest');
		const { user, success } = yield post(origin, { username, password });

		// console.log(result);
		try {
			if (success && user?.username) {
				yield put({ type: AUTH.LOGIN.SUCCESS, payload: user });
				yield put({ type: Actions.AM_ONLINE });
			} else {
				// yield put({ type: AUTH.LOGIN.REQUEST, payload: user });
				yield put(Actions.updateUsernameFailure(username));
			}
		} catch (e) {
			yield put({ type: AUTH.LOGIN.FAILURE, payload: user });
		}
	} catch (e) {
		debugger; //error
		console.log(e);
	}
}

function* simpleLoginSaga(action) {
	try {
		const { username, password } = action.payload;
		const origin = originLink('simpleLogin');
		const { user, success } = yield post(origin, { username, password });
		try {
			if (success && user?.username) {
				yield put({ type: AUTH.LOGIN.SUCCESS, payload: user });
				yield put({ type: Actions.AM_ONLINE });
			} else {
				// yield put({ type: AUTH.LOGIN.REQUEST, payload: user });
				yield put(Actions.updateUsernameFailure(username));
			}
		} catch (e) {
			yield put({ type: AUTH.LOGIN.FAILURE, payload: user });
		}
	} catch (e) {
		debugger; //error
		console.log(e);
	}
}

function* rootSaga() {
	yield all([
		initAuthSaga(),
		takeLatest(AUTH.LOGIN.SUCCESS, onLoginSaga),
		takeLatest(Actions.CREATE_GUEST, createGuestSaga),
		takeLatest(Actions.SIMPLE_LOGIN, simpleLoginSaga)
	]);
}

export default rootSaga;
