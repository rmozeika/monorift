import {
	all,
	call,
	delay,
	put,
	take,
	takeLatest,
	actionChannel
} from 'redux-saga/effects';
import 'isomorphic-unfetch';

import { CODE } from '@actions';
const { REQUEST } = CODE;

function* loadCode(action) {
	const repo = yield call(fetch, '/code/repo');
}
function* loadDataSaga() {
	try {
		const res = yield fetch('https://jsonplaceholder.typicode.com/users');
		const data = yield res.json();
		yield put(loadDataSuccess(data));
	} catch (err) {
		console.log(err);
		// yield put(failure(err));
	}
}

function* rootSaga() {
	yield takeLatest(REQUEST, loadDataSaga);
}

export default rootSaga;
