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

import * as Actions from '../actions';
import { originLink } from '../core/utils';

function* onlineUsersSaga() {
	// yield take(types.initUsers)
	yield (data = call(loadOnlineUsersSaga, 'online', Actions.setOnlineUsers));
	console.log(data);
	// yield put = put(Actions.setOnlineUsers);
	// yield put(setUsersSuccess(Users));
	// while (true) {
	//   yield put(tickClock(false))
	//   yield delay(1000)
	// }
}
function* loadOnlineUsersSaga(nsp, onComplete) {
	try {
		const origin = originLink(nsp || 'online');
		const res = yield fetch(origin, { method: 'POST' });
		debugger;
		const data = yield res.json();
		yield put(onComplete(data));
		// yield put(setOnlineUsers(data));
	} catch (err) {
		yield put(failure(err));
	}
}

function* rootSaga() {
	yield all([
		// takeLatest(ActionTypes.loadData, loadDataSaga),
		takeLatest(Actions.GET_ONLINE_USERS, onlineUsersSaga)
	]);
}

export default rootSaga;
