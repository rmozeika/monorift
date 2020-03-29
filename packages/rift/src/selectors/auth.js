import { createSelector } from 'reselect';

export const loggedIn = state => state.auth.loggedIn;
export const getSelfUser = state => state.auth.user;
export const getSelfUsername = state => {
	return state.auth.user.username;
};
export const getSelfId = state => state.auth.user.oauth_id;

export const getIsTempUsername = state => state.auth.user.usingTempUsername;
export const getAlert = state => state.auth.alert;
export const getOnlineOfflineUsernames = createSelector(
	[loggedIn, getSelfUser],
	(isLoggedIn, data) => {
		if (!isLoggedIn) return null;
		return data;
	}
);
