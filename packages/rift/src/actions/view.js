export const SET_TAB_VIEW = 'SET_TAB_VIEW';
export const setTabView = index => ({
	type: SET_TAB_VIEW,
	payload: index
});
export const SET_IS_MOBILE = 'SET_IS_MOBILE';

export const setIsMobile = isMobile => ({
	type: SET_IS_MOBILE,
	payload: isMobile
});

export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER';
export const search = input => ({
	type: SET_SEARCH_FILTER,
	payload: input
});

export const HANDLE_FILTER_CHANGE = 'HANDLE_FILTER_CHANGE';
export const handleFilterChange = input => ({
	type: HANDLE_FILTER_CHANGE,
	payload: input
});
