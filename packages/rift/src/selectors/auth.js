import { createSelector } from 'reselect';

export const loggedIn = state => state.auth.loggedIn;
export const getSelfUser = state => state.auth.user;
export const getSelfUsername = state => state.auth.user.username;

export const getOnlineOfflineUsernames = createSelector(
	[loggedIn, getSelfUser],
	(isLoggedIn, data) => {
		if (!isLoggedIn) return null;
		return data;
	}
);
