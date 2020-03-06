import { combineReducers } from 'redux';
import { ActionTypes } from '../actions';
import { CODE } from '../actions';
const { SET_CODE, GET_CODE, LOAD_CODE } = CODE;

const createReducer = (initialState, handlers) => {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			return handlers[action.type](state, action);
		} else {
			return state;
		}
	};
};

const codeReducer = createReducer([], {
	SET_CODE: (codeState, action) => {
		const { name, text } = action.code;
		return { ...codeState, [name]: text };
	}
});
export default codeReducer;
function test() {
	console.log(test);
}
