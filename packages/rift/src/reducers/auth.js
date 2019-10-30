import { combineReducers } from 'redux';
import { AUTH } from '../actions';
const { LOGIN } = AUTH;

const createReducer = (initialState, handlers) => {
    return function reducer(state = initialState, action) {
      if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
      } else {
        return state;
      }
    };
};

const authReducer = createReducer({}, {
    [LOGIN.SUCCESS]: (authState, action) => {
        const { picture, nickname, displayName } = action.payload;
        return { user: { picture, nickname, displayName }, loggedIn: true  };
    },
    [LOGIN.REQUEST]: (authState, action) => {
      // const { picture, nickname, displayName } = action.payload;
      return { user: {}, loggedIn: false  };
  }
});
export default authReducer;
