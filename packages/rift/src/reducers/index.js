import config, * as fromConfig from './config';
import code, * as fromCode from './code';
import auth, * as fromAuth from './auth';
import callReducer, * as fromCall from './call';
import tiffany from './tiffany';


import { combineReducers } from 'redux';

export const initialState = {
    config: {},
    code: { file1: 'beforeafter' },
    auth: { loggedIn: false, user: {}},
    call: { 
      peerConn: { 
        conn: null, created: false, config: {}, handlersAttached: false 
      }, 
      candidate: {},
      constraints: { 
        mediaStream: { audio: true, video: false }
      }
    },
    tiffany: { 
      answers: { ['1']: { value: { ['1']: null, ['2']: null}, correct: false } , ['2']:  { value: null, correct: false }, ['3']:  { value: null, correct: false } }
    }
};

export default combineReducers({
  config,
  code,
  auth,
  call: callReducer,
  tiffany
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

export const updateItemInArray = (array, itemId, updateItemCallback) => {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      return item;
    }

    const updatedItem = updateItemCallback(item);
    return updatedItem;
  });

  return updatedItems;
};

  
    
