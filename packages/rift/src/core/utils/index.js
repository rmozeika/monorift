import { Platform } from 'react-native';

export const originLink = type => {
	const paths = {
		login: '/auth/login',
		logout: '/auth/logout',
		call: '/call',
		online: '/users/online',
		users: '/users',
		userList: '/users/all',
		friends: '/users/friends',
		addFriend: '/users/friends/add',
		acceptFriend: '/users/friends/accept',
		rejectFriend: '/users/friends/reject'
	};
	let path = paths[type] || '';
	let host = window.location.origin;
	let link = `${host}${path}`;
	return link;
};
