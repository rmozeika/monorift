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
import { originLink } from '../core/utils';
import 'isomorphic-unfetch';

import * as Actions from '@actions';

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
		const payload = yield take(socketChannel);
		console.log('GOT MESSAGE, AUTH', payload);

		try {
			if (payload?.username) {
				yield put({ type: AUTH.LOGIN.SUCCESS, payload });
			} else {
				yield put({ type: AUTH.LOGIN.REQUEST, payload });
			}
		} catch (e) {
			yield put({ type: AUTH.LOGIN.FAILURE, payload });
			console.log(e);
		}
	}
}
function* onLoginSaga() {
	console.log('on log in success');
	yield put(Actions.fetchFriends());
	console.log('fetching friends');
}
function* rootSaga() {
	yield all([initAuthSaga(), takeLatest(AUTH.LOGIN.SUCCESS, onLoginSaga)]);
}

export default rootSaga;
