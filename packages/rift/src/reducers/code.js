import { combineReducers } from 'redux';
import { ActionTypes } from '../actions';
import { CODE } from '../actions';
const { SET_CODE, GET_CODE, LOAD_CODE } = CODE;
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

// const codeReducer = (state = {}, action) => {
//     switch (action.type) {
//         case ActionTypes.setCode:
//             return {
//                 ...state,
//                 ...action.code
//             }
//         // case ActionTypes.get
//         default: 
//             return state
        
//     }
// }

const codeReducer = createReducer([], {
    SET_CODE: (codeState, action) => {
        const { name, text } = action.code;
        return { ...codeState, [name]: text };
    },
    // VISIBILITY_FILTER: (visibilityState, action) => {

    // } 
});
export default codeReducer;
function test() {
  console.log(test);
}
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
//     codeReducer
// })
// export default codeReducer;

// export const getCode = state => state.byName;




// export const setProduct = (state, product =>