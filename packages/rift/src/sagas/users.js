import {
	all,
	call,
	delay,
	put,
	take,
	takeLatest,
	actionChannel,
	select
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as AuthSelectors from '@selectors/auth';
import 'isomorphic-unfetch';
import io from 'socket.io-client';

import * as Actions from '@actions';
import { originLink } from '../core/utils';
const socketServerURL = originLink();
let socket;
const selectUsers = state => {
	return state.users.list;
};
function* fetchUsers() {
	try {
		const origin = originLink('userList');

		const res = yield fetch(origin, { method: 'POST' });
		const data = yield res.json();
		yield put(Actions.setUsers(data));
		const users = yield select(selectUsers);

		yield put(Actions.fetchOnlineUsers());
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

		return () => {
			//socket.off('login', handler);
		};
	});

function* initSocketSaga() {
	try {
		const socket = yield call(connect);
	} catch (e) {
		console.log('init socket error', e);
	}
	console.log('create user socket channel');
	//socket.send('hi');
	const socketChannel = yield call(createSocketChannel, socket);
	console.log('take channel');
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
function* rootSaga() {
	yield all([
		initSocketSaga(),
		// onlineUsersSaga(),
		fetchUsers(),
		takeLatest(Actions.FETCH_USERS, fetchUsers),
		takeLatest(Actions.FETCH_ONLINE_USERS, onlineUsersSaga),
		takeLatest(Actions.FETCH_FRIENDS, loadFriendsSaga),
		takeLatest(Actions.ADD_FRIEND, addFriendSaga),
		takeLatest(Actions.RESPOND_FRIEND_REQUEST, respondFriendRequestSaga),
		takeLatest(Actions.UPDATE_USERNAME, updateUsernameSaga)
	]);
}

export default rootSaga;
