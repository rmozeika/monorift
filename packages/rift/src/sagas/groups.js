import {
	all,
	call,
	delay,
	put,
	take,
	takeLatest,
	actionChannel,
	cancel,
	cancelled,
	fork,
	select
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as AuthSelectors from '@selectors/auth';
import * as UserSelectors from '@selectors/users';

import { getFriends, getUserById } from '@core/api/apollo';
import { getGroupMembers, getAllGroups } from '@core/api/graphql/groups';
import * as Actions from '@actions';
import { originLink } from '@core/utils';
function* fetchGroups() {
	try {
		const data = yield call(getAllGroups);
		debugger; //remove
		yield put(Actions.setGroups(data));
	} catch (err) {
		console.warn(err);
	}
}

function* rootSaga() {
	yield all([fetchGroups()]);
}

export default rootSaga;
