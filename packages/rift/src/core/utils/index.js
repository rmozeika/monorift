import { Platform } from 'react-native';
export * from './notifications';
export const originLink = type => {
	const paths = {
		login: '/auth/login',
		logout: '/auth/logout',
		call: '/call',
		online: '/users/online',
		users: '/users',
		userList: '/users/all',
		friends: '/friends',
		addFriend: '/friends/add',
		acceptFriend: '/friends/accept',
		rejectFriend: '/friends/reject',
		updateUsername: '/users/username/temp',
		createGuest: '/users/guest/register',
		simpleLogin: '/auth/simple/login'
	};
	let path = paths[type] || '';
	let host = window.location.origin;
	let link = `${host}${path}`;
	return link;
};

export const navigateToSignin = () => {
	Linking.openURL(originLink('login')).catch(err => {
		console.error('An error occurred', err);
	});
};

export const navigateToSignout = () => {
	Linking.openURL(originLink('logout')).catch(err => {
		console.error('An error occurred', err);
	});
};
