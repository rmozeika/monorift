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
function* graphqlSubscriber(sub, { type, gid }) {
	channel = yield call(createGqlChannel, sub);
	try {
		//yield sub;
		while (true) {
			const event = yield take(channel);
			const { id } = event;
			// const { gid, id } = yield call(GqlGroups.getGroupsMemberOf);
			yield put(Actions.addMember({ gid, id }));
			// const hSub = sub.subscribe(event => {
			// 	emit(event.data.memberJoined);
			// 	debugger; //remove
			// 	// console.log('subscribe JOIN', x);
			//   });
			/////const { gid } = yield takeLatest(WATCH_GROUP);
			////sub.refetch(gid);
			//   const sub = GqlGroups.watchGroupMembers(gid, handler);
		}
	} finally {
		if (yield cancelled()) {
			channel.close();
		}
	}
}
const createGqlChannel = sub =>
	eventChannel(emit => {
		console.log('created user socket event channel');
		// const handler = (msg, secondArg) => {
		// 	debugger; //remove
		// 	// let msg = { message: data }; //from: this._id };
		// 	// if (secondArg) {
		// 	// 	const { constraints, users, from } = secondArg;
		// 	// 	msg = { ...msg, ...secondArg };
		// 	// }
		// 	console.log('USER SOCKET MESSAGE', msg);
		// 	emit(msg);
		// };
		// debugger; //remove
		// const sub = GqlGroups.watchGroupMembers(gid, handler);
		const hSub = sub.subscribe(event => {
			emit(event.data.memberJoined);
			debugger; //remove
			// console.log('subscribe JOIN', x);
		});

		// const onCandidateHandler = candidate => {
		// 	put({ type: ADD_CANDIDATE, candidate });
		// };
		// socket.on('message', handler);
		// socket.on('broadcast', handler);
		// socket.on('disconnect', reason => {
		// 	socket.connect();
		// });

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
				debugger; //remove
			}
		};
		return onClose;
	});
function* watchMembers() {
	let channel;
	let subs = {};
	try {
		while (true) {
			// will extend to multiple actions
			const { type, gid } = yield take(Actions.WATCH_GROUP);
			if (subs[type]?.task) {
				yield cancel(subs[type].task);
			}
			subs[type] = {};
			subs[type].sub = GqlGroups.watchGroupMembers(gid);
			subs[type].task = yield fork(graphqlSubscriber, subs[type].sub, { gid });
		}
		// sub = createdSub;
		debugger; //remove
		const subscriber = yield fork(graphqlSubscriber, subs[type], { gid });
		// subs[type] = GqlGroups.watchGroupMembers(gid);
		// 	// sub = createdSub;
		// 	debugger; //remove
		// 	const subscriber = yield fork(graphqlSubscriber, subs[type], { gid });
		if (!subs[type]) {
			subs[type] = GqlGroups.watchGroupMembers(gid);
			// sub = createdSub;
			debugger; //remove
			const subscriber = yield fork(graphqlSubscriber, subs[type], { gid });
		} else {
			subs[type].refetch({ gid });
		}
		// const sub = GqlGroups.watchGroupMembers(gid);
		// const subscriber = yield call(graphqlSubscriber, sub, { gid });
		// while (true) {
		// 	debugger; //remove
		// 	sub.refetch({ gid });

		// }

		// channel = yield call(createGqlChannel, gid);
		// const event = yield take(channel);
		// const { id } = event;
		// // const { gid, id } = yield call(GqlGroups.getGroupsMemberOf);
		// yield put(Actions.addMember({ gid, id }));
	} catch (e) {
		debugger; //error
		console.warn('WATCH_MEMBERS', e);
	} finally {
		if (yield cancelled()) {
			// cancel subscriber
			// debugger; //remove
			// try {
			// 	channel.close();
			// } catch (e) {
			// 	console.error(e);
			// 	debugger; //error
			// }
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
