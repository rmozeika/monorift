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

// import es6promise from 'es6-promise'
import 'isomorphic-unfetch';

import * as Actions from '../actions';

const {
    AUTH
} = Actions;
import io from 'socket.io-client';

const socketServerURL = window.location.origin;
let socket;

const connect = () => {
    socket = io(socketServerURL);
    return new Promise((resolve) => {
        socket.on('connect', () => {
            resolve(socket);
        });
    });
};

const createSocketChannel = socket => eventChannel((emit) => {
    const handler = (data) => {
      emit(data);
    };
    socket.on('login', handler);
    socket.emit('check_auth', (data) => {
        emit(data);
    });
    return () => {
      socket.off('login', handler);
    };
  });

function* initAuthSaga() {
    const socket = yield call(connect);
    socket.send('hi');
    const socketChannel = yield call(createSocketChannel, socket);
    while (true) {
        const payload = yield take(socketChannel);
        try {
            yield put({ type: AUTH.LOGIN.SUCCESS,  payload });
        } catch(e) {
            console.log(e);
        }
        
        console.log(AUTH.LOGIN.SUCCESS);
    }
}

function* rootSaga() {
    yield all([
        initAuthSaga()
        // takeLatest(ActionTypes.login, loadDataSaga),
        // takeLatest(ActionTypes.initConfig, initConfigSaga)
    ]);
}

export default rootSaga;