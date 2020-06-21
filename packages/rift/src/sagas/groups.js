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
function* graphqlSubscriber(sub, handler, { type, gid }) {
	channel = yield call(createGqlChannel, sub, handler);
	try {
		//yield sub;
		while (true) {
			const event = yield take(channel);
			const { id } = event;
			yield put(Actions.addMember({ gid, id }));
		}
	} finally {
		if (yield cancelled()) {
			channel.close();
		}
	}
}
const createGqlChannel = (sub, handler) =>
	eventChannel(emit => {
		console.log('created user socket event channel');

		const hSub = sub.subscribe(event => {
			const data = handler(event);
			emit(data);
		});
		const onClose = () => {
			try {
				console.log(sub);
				console.log(hSub);
				hSub.unsubscribe();
				console.log(hSub);
				// sub.stopPolling();
				// sub.complete();
			} catch (e) {
				console.log(e);
				debugger; // error
			}
		};
		return onClose;
	});
function* watchMembers() {
	let channel;
	let subs = {
		// CHANGE TO MEMBERS
		[Actions.WATCH_GROUP]: {
			task: null,
			sub: null,
			createSub: ({ gid }) => GqlGroups.watchGroupMembers(gid),
			handler: event => event.data.memberJoined
		}
	};
	try {
		while (true) {
			// will extend to multiple actions
			const types = Object.keys(subs);
			const action = yield take(types);
			const { type, gid } = action;
			if (subs[type]?.task !== null) {
				yield cancel(subs[type].task);
			}
			const { sub, createSub, handler, task } = subs[type];
			// subs[type] = {};
			subs[type].sub = createSub(action); //GqlGroups.watchGroupMembers(gid);
			subs[type].task = yield fork(graphqlSubscriber, subs[type].sub, handler, {
				gid
			});
		}
	} catch (e) {
		debugger; //error
		console.warn('WATCH_MEMBERS', e);
	} finally {
		if (yield cancelled()) {
			const subTypes = Object.keys(subs);
			// shouldn't be cancelled
			for (let i; i < subTypes.length; i++) {
				const type = subTypes[i];
				const sub = subs[type];
				yield cancel(sub.task);
				// delete
			}
			// Object.keys(subs).forEach(type => {
			// 	const sub = subs[type];
			// 	yield cancel(sub.task);
			// });
		}
	}
}

function* rootSaga() {
	yield all([
		takeLatest(Actions.FETCH_MY_GROUPS, myGroups),
		takeLatest(Actions.FETCH_GROUPS, fetchGroups),
		takeLatest(Actions.FETCH_GROUP_MEMBERS, fetchGroupMembers),
		// take(Actions.WATCH_GROUP, watchMembers),
		watchMembers()
	]);
}

export default rootSaga;
