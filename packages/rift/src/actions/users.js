export const FETCH_ONLINE_USERS = 'FETCH_ONLINE_USERS';
export const SET_ONLINE_USERS = 'SET_ONLINE_USERS';
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
export const updateUser = (oauth_id, data, user = {}) => ({
	type: UPDATE_USER,
	id: oauth_id || user.oauth_id,
	payload: {
		data,
		user
	}
});
export const fetchOnlineUsers = () => ({
	type: FETCH_ONLINE_USERS
});
export const setOnlineUsers = users => ({
	type: SET_ONLINE_USERS,
	payload: users
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
export const UPDATE_USERNAME = 'UPDATE_USERNAME';
export const updateUsername = username => ({
	type: UPDATE_USERNAME,
	payload: username
});

export const UPDATE_USERNAME_SUCCESS = 'UPDATE_USERNAME_SUCCESS';
export const updateUsernameSuccess = username => ({
	type: UPDATE_USERNAME_SUCCESS,
	payload: username
});

export const UPDATE_USERNAME_FAILURE = 'UPDATE_USERNAME_FAILURE';
export const updateUsernameFailure = username => ({
	type: UPDATE_USERNAME_FAILURE,
	payload: username
});

export const ADD_ONLINE_USER = 'ADD_ONLINE_USER';
export const REMOVE_ONLINE_USER = 'REMOVE_ONLINE_USER';
export const addOnlineUser = user => ({
	type: ADD_ONLINE_USER,
	id: user.oauth_id,
	payload: user
});
export const removeOnlineUser = user => ({
	type: REMOVE_ONLINE_USER,
	id: user.oauth_id,
	payload: user
});
