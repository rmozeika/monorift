import { combineReducers } from 'redux'
import { ActionTypes } from '../actions';
const setConfig = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.setConfig:
      return {
          config: action.config,
          ...state
      }
    default:
      return state
  }
}
export const byName = (state = [], action = {}) => {
  switch (action.type) {
    // check this!
    case ActionTypes.setConfig:
      return action.config
    default:
      return state
  }
}

export default combineReducers({
  setConfig,
  byName
})

export const getConfig = state => state.byName;




// export const setProduct = (state, product =>