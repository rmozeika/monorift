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
import * as Actions from '@actions';
import { originLink } from '@core/utils';
const socketServerURL = originLink();
let socket;
const selectUsers = state => {
	return state.users.list;
};
// const selectUser = state => {
// 	return state.users.byId[]
// }
function* fetchUsers() {
	try {
		const origin = originLink('userList');

		// const res = yield fetch(origin, { method: 'POST' });
		// const data = yield res.json();
		const data = yield post(origin);
		yield put(Actions.setUsers(data));
		const users = yield select(selectUsers);

		// yield put(Actions.fetchOnlineUsers());
	} catch (err) {}
}
function* onlineUsersSaga() {
	yield (data = call(loadOnlineUsersSaga, 'online', Actions.setOnlineUsers));

	// yield put = put(Actions.setOnlineUsers);
	// yield put(setUsersSuccess(Users));
}
function* loadOnlineUsersSaga(nsp, onComplete) {
	try {
		const origin = originLink(nsp || 'online');

		const res = yield fetch(origin, { method: 'POST' });
		const data = yield res.json();
		yield put(onComplete(data));
		// yield put(setOnlineUsers(data));
	} catch (err) {}
}
function* loadFriendsSaga() {
	try {
		const origin = originLink('friends');

		const res = yield fetch(origin, { method: 'POST' });
		const data = yield res.json();
		yield put(Actions.setFriends(data));
	} catch (err) {}
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
		// yield put(
		// 	Actions.updateUser(action.payload.oauth_id, {
		// 		friendStatus: 'S',
		// 		isFriend: true
		// 	})
		// );
	} catch (err) {}
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
			// 	Actions.updateUser(friend.oauth_id, {
			// 		friendStatus: friendStatuKey,
			// 		isFriend: didAccept
			// 	})
			// );
		} catch (err) {}
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
	} catch (err) {}
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
		const oldOnMsg = (msg, secondArg) => {
			if (msg.type == 'candidate') {
				onCandidateHandler(msg.candidate);
			}
			if (msg.type == 'offer') {
				put({ type: GOT_MESSAGE, msg }, constraints);
			}
		};

		const onClose = () => {
			debugger; //remove
			socket.close(true);
			//socket.off('login', handler);
		};
		return onClose;
	});

function* startSocketSaga() {
	const task = yield fork(initSocketSaga);
	const restart = yield take(Actions.CLOSE_USER_SOCKET);
	yield cancel(task);
	debugger; //remove
	if (restart) {
		debugger; //remove
		const newTask = yield fork(initSocketSaga);
		yield take(Actions.CLOSE_USER_SOCKET);
		yield cancel(newTask);
	} else {
		while (yield take(Actions.START_USER_SOCKET)) {
			debugger; //remove
			const newTask = yield fork(initSocketSaga);
			yield take(Actions.CLOSE_USER_SOCKET);
			yield cancel(newTask);
		}
	}
}
function* initSocketSaga() {
	const socket = yield call(connect);

	const socketChannel = yield call(createSocketChannel, socket);

	try {
		// try {
		// } catch (e) {
		// 	console.log('init socket error', e);
		// }
		console.log('create user socket channel');
		//socket.send('hi');
		// yield fork(closeSocket, socketChannel);
		// while (true) {
		// 	debugger; //remove
		while (true) {
			const message = yield take(socketChannel);
			try {
				const { id, data, user } = message;
				yield put(Actions.updateUser(id, data, user));
				if (data.online == true) {
					const user = { username: message.username, oauth_id: id };
					yield put(Actions.addOnlineUser(user));
				} else if (message.online == false) {
					const user = { username: message.username, oauth_id: id };
					yield put(Actions.removeOnlineUser(user));
				}
			} catch (e) {
				//yield put({ type: AUTH.LOGIN.FAILURE,  payload });
			}
		}
		// yield fork(socketMessageSaga, socketChannel);
		// }
		debugger; //remove
		// yield take(Actions.CLOSE_USER_SOCKET);
		// yield cancel(socketMessageSaga);
		console.log('take channel');
	} catch (e) {
		debugger; //remove
		console.log(e);
	} finally {
		if (yield cancelled()) {
			console.log('cancelled socketsaga');
			debugger; //remove
			socketChannel.close();
			console.log('countdown cancelled');
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
				const user = { username: message.username, oauth_id: id };
				yield put(Actions.addOnlineUser(user));
			} else if (message.online == false) {
				const user = { username: message.username, oauth_id: id };
				yield put(Actions.removeOnlineUser(user));
			}
		} catch (e) {
			//yield put({ type: AUTH.LOGIN.FAILURE,  payload });
		}
	}
}
function* closeSocket(socketChannel) {
	while (true) {
		debugger; //remove
		yield take(Actions.CLOSE_USER_SOCKET);
		socketChannel.close();
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

	socket.emit('AM_ONLINE');
}
function* addUserSaga({ payload, id }) {
	try {
		debugger; //remove
		if (!id) return;
		const user = yield select(UserSelectors.getUserById, { id });
		console.log(user);
		if (!user) {
			yield put(Actions.addUser(id, { ...payload.user, ...payload.data }));
		}
		debugger; //remove
	} catch (e) {
		debugger; //remove
		console.log(e);
	}
}
function* rootSaga() {
	yield all([
		startSocketSaga(),
		// onlineUsersSaga(),
		fetchUsers(),
		takeLatest(Actions.FETCH_USERS, fetchUsers),
		takeLatest(Actions.FETCH_ONLINE_USERS, onlineUsersSaga),
		takeLatest(Actions.FETCH_FRIENDS, loadFriendsSaga),
		takeLatest(Actions.ADD_FRIEND, addFriendSaga),
		takeLatest(Actions.RESPOND_FRIEND_REQUEST, respondFriendRequestSaga),
		takeLatest(Actions.UPDATE_USERNAME, updateUsernameSaga),
		takeLatest(Actions.AM_ONLINE, amOnlineSaga),
		takeLatest(Actions.UPDATE_USER, addUserSaga)
	]);
}

export default rootSaga;
