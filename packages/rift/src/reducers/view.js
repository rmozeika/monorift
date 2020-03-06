import { combineReducers } from 'redux';
import * as Actions from '../actions';
export const initialState = {
	tab: 0,
	mobile: true
};
// tab
// 0 = friends
// 1 = users
// 2 = talk
export const tabTypeIndexes = {
	0: 'friends',
	1: 'users',
	2: 'talk'
};
export const getTabType = index => tabTypeIndexes[index];

const viewReducer = (state = {}, action) => {
	switch (action.type) {
		case Actions.SET_TAB_VIEW:
			return { ...state, tab: action.payload };
		case Actions.SET_IS_MOBILE:
			return { ...state, mobile: action.payload };
		default:
			return state;
	}
};
export default viewReducer;
