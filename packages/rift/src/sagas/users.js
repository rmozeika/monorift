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

import 'isomorphic-unfetch';
import io from 'socket.io-client';

import * as Actions from '@actions';
import { originLink } from '../core/utils';
const socketServerURL = originLink('users');
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
	socket = io(socketServerURL);
	return new Promise(resolve => {
		socket.on('connect', () => {
			resolve(socket);
		});
	});
};
const createSocketChannel = socket =>
	eventChannel(emit => {
		const handler = (data, secondArg) => {
			let msg = { message: data }; //from: this._id };
			if (secondArg) {
				const { constraints, users, from } = secondArg;
				msg = { ...msg, ...secondArg };
			}
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
	const socket = yield call(connect);
	//socket.send('hi');
	const socketChannel = yield call(createSocketChannel, socket);
	while (true) {
		const { message } = yield take(socketChannel);

		try {
			if (message.online == true) {
				const user = { username: message.username };
				yield put(Actions.addOnlineUser(user));
			} else if (message.online == false) {
				const user = { username: message.username };
				yield put(Actions.removeOnlineUser(user));
			}
		} catch (e) {
			//yield put({ type: AUTH.LOGIN.FAILURE,  payload });
		}
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
		takeLatest(Actions.RESPOND_FRIEND_REQUEST, respondFriendRequestSaga)
	]);
}

export default rootSaga;
