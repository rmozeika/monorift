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

import * as Actions from '../actions';
import { originLink } from '../core/utils';
const socketServerURL = originLink('users');
let socket;
const selectUsers = state => {
	return state.users.list;
};
function* fetchUsers() {
	debugger; //remove
	try {
		const origin = originLink('userList');
		console.log('origin link', origin);
		const res = yield fetch(origin, { method: 'POST' });
		const data = yield res.json();
		yield put(Actions.setUsers(data));
		const users = yield select(selectUsers);
		debugger; //remove

		yield put(Actions.fetchOnlineUsers());
	} catch (err) {
		console.log(err);
	}
}
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
		console.log('origin link', origin);
		const res = yield fetch(origin, { method: 'POST' });
		const data = yield res.json();
		debugger; //remove
		yield put(onComplete(data));
		// yield put(setOnlineUsers(data));
	} catch (err) {
		console.log(err);
	}
}
function* loadFriendsSaga() {
	try {
		const origin = originLink('friends');
		console.log('origin link', origin);
		const res = yield fetch(origin, { method: 'POST' });
		const data = yield res.json();
		yield put(Actions.setFriends(data));
	} catch (err) {
		console.log(err);
	}
}
function* addFriend(action) {
	try {
		const origin = originLink('addFriend');
		console.log('origin link', origin);
		debugger; //remove
		const res = yield fetch(origin, {
			method: 'POST',
			body: { friend: action.payload }
		});
		debugger; //remove
		console.log(res);
	} catch (err) {
		console.log(err);
	}
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
			console.log('emitting message from socketchannel');
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
			console.log('disconnected');
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
				const user = { name: message.name };
				yield put(Actions.addOnlineUser(user));
			} else if (message.online == false) {
				const user = { name: message.name };
				yield put(Actions.removeOnlineUser(user));
			}
		} catch (e) {
			console.log('Call Saga Error', e);
			//yield put({ type: AUTH.LOGIN.FAILURE,  payload });
		}
	}
}
function* rootSaga() {
	yield all([
		initSocketSaga(),
		fetchUsers(),
		takeLatest(Actions.FETCH_USERS, fetchUsers),
		takeLatest(Actions.FETCH_ONLINE_USERS, onlineUsersSaga),
		takeLatest(Actions.FETCH_FRIENDS, loadFriendsSaga)
	]);
}

export default rootSaga;
