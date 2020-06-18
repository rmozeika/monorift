export const FETCH_USERS = 'FETCH_USERS';
export const fetchUsers = () => ({
	type: FETCH_USERS
});
export const SET_USERS = 'SET_USERS';
export const setUsers = users => ({
	type: SET_USERS,
	payload: users
});

export const UPDATE_USER = 'UPDATE_USER';
export const updateUser = (id, data, user = {}) => ({
	type: UPDATE_USER,
	id: id || user.id,
	payload: {
		data,
		user
	}
});

export const ADD_USER = 'ADD_USER';
export const addUser = (id, user) => ({
	type: ADD_USER,
	user,
	id
});

export const FETCH_FRIENDS = 'FETCH_FRIENDS';
export const fetchFriends = () => ({
	type: FETCH_FRIENDS
});
export const SET_FRIENDS = 'SET_FRIENDS';
export const setFriends = friends => ({
	type: SET_FRIENDS,
	payload: friends
});
export const ADD_FRIEND = 'ADD_FRIEND';
export const addFriend = friend => ({
	type: ADD_FRIEND,
	payload: friend
});

export const RESPOND_FRIEND_REQUEST = 'RESPOND_FRIEND_REQUEST';
export const respondFriendRequest = (friend, didAccept) => ({
	type: RESPOND_FRIEND_REQUEST,
	payload: { friend, didAccept }
});
export const REMOVE_FRIEND = 'ADD_FRIEND';
export const removeFriend = friend => ({
	type: REMOVE_FRIEND,
	payload: friend
});

export const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
export const REMOVE_ONLINE_USER = 'REMOVE_ONLINE_USER';
export const addOnlineUser = user => ({
	type: ADD_ONLINE_USER,
	id: user.id,
	payload: user
});
export const removeOnlineUser = user => ({
	type: REMOVE_ONLINE_USER,
	id: user.id,
	payload: user
});

export const AM_ONLINE = 'AM_ONLINE';
export const setAmOnline = () => ({
	type: AM_ONLINE
});

export const START_USER_SOCKET = 'START_USER_SOCKET';
export const CLOSE_USER_SOCKET = 'CLOSE_USER_SOCKET';

export const closeUserSocket = restart => ({
	type: CLOSE_USER_SOCKET,
	restart
});
