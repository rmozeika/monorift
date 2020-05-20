import auth from './auth';
import code from './code';
import config from './config';
import callSaga from './call';
import usersSaga from './users';
import peerSaga from './peer-connection';

import {
	all,
	call,
	delay,
	put,
	take,
	takeLatest,
	actionChannel
} from 'redux-saga/effects';

export default function*() {
	yield all([auth(), code(), config(), callSaga(), usersSaga(), peerSaga()]);
}
