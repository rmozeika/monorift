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

import 'isomorphic-unfetch';
import io from 'socket.io-client';
import { get, post } from '@core/api';
import * as GqlUsers from '@core/api/graphql/users';

import * as Actions from '@actions';
import { originLink } from '@core/utils';
const socketServerURL = originLink();
let socket;
const selectUsers = state => {
	return state.users.list;
};

function* fetchUsers() {
	try {
		const origin = originLink('userList');
		const data = yield post(origin);
		yield put(Actions.setUsers(data));
		const users = yield select(selectUsers);
	} catch (err) {
		console.warn(err);
	}
}

function* fetchFriends() {
	try {
		const friends = yield call(GqlUsers.getFriends);
		yield put(Actions.setUsers(data));
	} catch (err) {
		console.warn(err);
	}
}

function* addFriendSaga(action) {
	try {
		const origin = originLink('addFriend');

		const res = yield fetch(origin, {
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: JSON.stringify({ friend: action.payload })
		});
	} catch (err) {
		console.warn(err);
	}
}
function* respondFriendRequestSaga(action) {
	const { friend, didAccept } = action.payload;
	// can combine these
	if (didAccept) {
		try {
			const origin = originLink('acceptFriend');

			const res = yield fetch(origin, {
				headers: {
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				method: 'POST',
				body: JSON.stringify({ friend })
			});
			// const friendStatuKey = didAccept ? 'A' : 'R';
			// yield put(
			// 	Actions.updateUser(friend.id, {
			// 		friendStatus: friendStatuKey,
			// 		isFriend: didAccept
			// 	})
			// );
		} catch (err) {
			console.warn(err);
		}
		return;
	}
	try {
		const origin = originLink('rejectFriend');

		const res = yield fetch(origin, {
			headers: {
				'Content-Type': 'application/json'
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
			body: JSON.stringify({ friend })
		});
	} catch (err) {
		console.warn(err);
	}
}
const connect = () => {
	// socket = io(socketServerURL);
	socket = io('/users');
	return new Promise(resolve => {
		socket.on('connect', () => {
			resolve(socket);
		});
	});
};
const createSocketChannel = socket =>
	eventChannel(emit => {
		console.log('created user socket event channel');
		const handler = (msg, secondArg) => {
			// let msg = { message: data }; //from: this._id };
			// if (secondArg) {
			// 	const { constraints, users, from } = secondArg;
			// 	msg = { ...msg, ...secondArg };
			// }
			console.log('USER SOCKET MESSAGE', msg);
			emit(msg);
		};
		const onCandidateHandler = candidate => {
			put({ type: ADD_CANDIDATE, candidate });
		};
		socket.on('message', handler);
		socket.on('broadcast', handler);
		socket.on('disconnect', reason => {
			socket.connect();
		});

		const onClose = () => {
			socket.close(true);
			//socket.off('login', handler);
		};
		return onClose;
	});

function* startSocketSaga() {
	const task = yield fork(socketListener);
	const restart = yield take(Actions.CLOSE_USER_SOCKET);
	yield cancel(task);
	if (restart) {
		const newTask = yield fork(socketListener);
		yield take(Actions.CLOSE_USER_SOCKET);
		yield cancel(newTask);
	} else {
		while (yield take(Actions.START_USER_SOCKET)) {
			const newTask = yield fork(socketListener);
			yield take(Actions.CLOSE_USER_SOCKET);
			yield cancel(newTask);
		}
	}
}
function* socketListener() {
	const socket = yield call(connect);

	const socketChannel = yield call(createSocketChannel, socket);

	try {
		console.log('created user socket channel');
		while (true) {
			const message = yield take(socketChannel);
			try {
				const { id, data, user } = message;
				yield put(Actions.updateUser(id, data, user));
				if (data.online == true) {
					const user = { username: message.username, id: id };
					yield put(Actions.addOnlineUser(user));
				} else if (message.online == false) {
					const user = { username: message.username, id: id };
					yield put(Actions.removeOnlineUser(user));
				}
			} catch (e) {
				console.warn(e);
			}
		}
	} catch (e) {
		console.warn(e);
	} finally {
		if (yield cancelled()) {
			console.log('cancelled user socket');
			socketChannel.close();
		}
	}
}
function* socketMessageSaga(socketChannel) {
	while (true) {
		const message = yield take(socketChannel);
		try {
			const { id, data, user } = message;
			yield put(Actions.updateUser(id, data, user));
			if (data.online == true) {
				const user = { username: message.username, id: id };
				yield put(Actions.addOnlineUser(user));
			} else if (message.online == false) {
				const user = { username: message.username, id: id };
				yield put(Actions.removeOnlineUser(user));
			}
		} catch (e) {
			//yield put({ type: AUTH.LOGIN.FAILURE,  payload });
		}
	}
}

function* updateUsernameSaga({ payload }) {
	const currentUsername = yield select(AuthSelectors.getSelfUsername);
	const origin = originLink('updateUsername');

	const res = yield fetch(origin, {
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		method: 'POST',
		body: JSON.stringify({ username: payload })
	});
	const data = yield res.json();
	if (data.success) {
		yield put(Actions.updateUsernameSuccess(payload));
	} else {
		yield put(Actions.updateUsernameFailure(payload));
	}
}
function* amOnlineSaga({ payload }) {
	yield put(Actions.closeUserSocket(true));
	// yield put({ type: Actions.START_USER_SOCKET });
	yield put(Actions.fetchUsers());
	socket.emit('AM_ONLINE');
}
function* addUserSaga({ payload, id }) {
	try {
		if (!id) return;
		const user = yield select(UserSelectors.getUserById, { id });
		console.log(user);
		if (!user) {
			const fetchedUser = yield call(GqlUsers.getUserById, id);
			// yield put(Actions.addUser(id, { ...payload.user, ...payload.data }));
			yield put(Actions.addUser(id, fetchedUser));
		}
	} catch (e) {
		console.warn(e);
	}
}
function* rootSaga() {
	yield all([
		startSocketSaga(),
		// onlineUsersSaga(),
		fetchUsers(),
		takeLatest(Actions.FETCH_USERS, fetchUsers),
		// takeLatest(Actions.FETCH_FRIENDS, loadFriendsSaga),
		takeLatest(Actions.ADD_FRIEND, addFriendSaga),
		takeLatest(Actions.RESPOND_FRIEND_REQUEST, respondFriendRequestSaga),
		takeLatest(Actions.UPDATE_USERNAME, updateUsernameSaga),
		takeLatest(Actions.AM_ONLINE, amOnlineSaga),
		takeLatest(Actions.UPDATE_USER, addUserSaga)
	]);
}

export default rootSaga;
