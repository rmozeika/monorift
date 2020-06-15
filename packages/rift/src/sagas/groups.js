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
import {
	getGroupMembers,
	getAllGroups,
	getGroupMembersIds
} from '@core/api/graphql/groups';
import * as Actions from '@actions';
import { originLink } from '@core/utils';
function* fetchGroups() {
	try {
		const data = yield call(getAllGroups);
		yield put(Actions.setGroups(data));
	} catch (err) {
		console.warn(err);
	}
}

function* fetchGroupMembers({ gid }) {
	try {
		const { members } = yield call(getGroupMembersIds, gid);
		yield put(Actions.setGroupMembers(gid, members));
	} catch (e) {
		console.warn(err);
	}
}

function* rootSaga() {
	yield all([
		takeLatest(Actions.FETCH_GROUPS, fetchGroups),
		takeLatest(Actions.FETCH_GROUP_MEMBERS, fetchGroupMembers)
	]);
}

export default rootSaga;
