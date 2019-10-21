import config, * as fromConfig from './config';
import code, * as fromCode from './code';
import auth, * as fromAuth from './auth';

import { combineReducers } from 'redux';

export const initialState = {
    config: {},
    code: { file1: 'beforeafter' },
    auth: { loggedIn: false, user: {}}
};

// import localization, * as fromLocalization from './localization'
// import {
//   cartReducer,
// } from 'react-shopping-cart';

export default combineReducers({
  config,
  code,
  auth
});

export const createReducer = (initialState, handlers) => {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state;
    }
  };
};

// function addTodo(todosState, action) {}
// function toggleTodo(todosState, action) {}
// function editTodo(todosState, action) {}

// const todosReducer = createReducer([], {
//   ADD_TODO: addTodo,
//   TOGGLE_TODO: toggleTodo,
//   EDIT_TODO: editTodo
// })
export const updateItemInArray = (array, itemId, updateItemCallback) => {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      // Since we only want to update one item, preserve all others as they are now
      return item;
    }

    // Use the provided callback to create an updated item
    const updatedItem = updateItemCallback(item)
    return updatedItem;
  });

  return updatedItems;
};
// export const getConfig = state => fromConfig.getConfig(state.config);

  
    
