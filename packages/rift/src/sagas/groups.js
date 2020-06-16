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

import * as GqlGroups from '@core/api/graphql/groups';
import * as Actions from '@actions';
import { originLink } from '@core/utils';
function* fetchGroups() {
	try {
		const data = yield call(GqlGroups.getAllGroups);
		yield put(Actions.setGroups(data));
	} catch (err) {
		console.warn(err);
	}
}

function* fetchGroupMembers({ gid }) {
	try {
		const { members } = yield call(GqlGroups.getGroupMembersIds, gid);
		yield put(Actions.setGroupMembers(gid, members));
	} catch (e) {
		console.warn(err);
	}
}
function* myGroups() {
	try {
		const data = yield call(GqlGroups.getGroupsMemberOf);
		yield put(Actions.setGroups(data));
	} catch (e) {
		console.warn(err);
	}
}

function* rootSaga() {
	yield all([
		takeLatest(Actions.FETCH_MY_GROUPS, myGroups),
		takeLatest(Actions.FETCH_GROUPS, fetchGroups),
		takeLatest(Actions.FETCH_GROUP_MEMBERS, fetchGroupMembers)
	]);
}

export default rootSaga;
