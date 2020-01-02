import { Platform } from 'react-native';

export const originLink = type => {
	const paths = {
		login: '/auth/login',
		logout: '/auth/logout',
		call: '/call'
	};
	let path = paths[type] || '';
	let host = window.location.origin;
	let link = `${host}${path}`;
	return link;
	// return `${host}${path}`;
	// if (Platform.OS == 'web') {
	// }

	// return 'robertmozeika.com';
};
