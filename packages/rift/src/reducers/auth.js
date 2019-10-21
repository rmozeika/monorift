import { combineReducers } from 'redux';
// import { ActionTypes } from '../actions';
import { AUTH } from '../actions';
const { LOGIN } = AUTH;
// import { createReducer, updateItemInArray } from './index.js'

const createReducer = (initialState, handlers) => {
    return function reducer(state = initialState, action) {
      if (handlers.hasOwnProperty(action.type)) {
        return handlers[action.type](state, action);
      } else {
        return state;
      }
    };
  };
// const setConfig = (state = {}, action) => {
//   switch (action.type) {
//     case ActionTypes.setConfig:
//       return {
//           config: action.config,
//           ...state
//       }
//     default:
//       return state
//   }
// }

// const authReducer = (state = {}, action) => {
//     switch (action.type) {
//         case ActionTypes.set
//             return {
//                 ...state,
//                 ...action.code
//             }
//         // case ActionTypes.get
//         default: 
//             return state
        
//     }
// }

const authReducer = createReducer({}, {
    [LOGIN.SUCCESS]: (authState, action) => {
        debugger;
        const { picture, nickname, displayName } = action.payload;
        return { user: { picture, nickname, displayName }, loggedIn: true  };
    },
    // VISIBILITY_FILTER: (visibilityState, action) => {

    // } 
});
export default authReducer;

// export const byName = (state = [], action = {}) => {
//   switch (action.type) {
//     // check this!
//     case ActionTypes.setConfig:
//       return action.config
//     default:
//       return state
//   }
// }

// export default combineReducers({
//     authReducer
// })
// export default authReducer;

// export const getCode = state => state.byName;




// export const setProduct = (state, product =>