/* global fetch */

import { all, call, delay, put, take, takeLatest, actionChannel } from 'redux-saga/effects';
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch';

import { CODE } from '../actions';
// import { setConfig } from './constants/ActionTypes';
const {  REQUEST, } = CODE;
//  
function* loadCode (action) {
  // yield take(types.initConfig)
  const repo = yield call(fetch, '/code/repo');
  // yield put = put(Actions.setConfig);
  // yield put(setConfigSuccess(config));
  // while (true) {
  //   yield put(tickClock(false))
  //   yield delay(1000)
  // }
}
function * loadDataSaga () {
  try {
    const res = yield fetch('https://jsonplaceholder.typicode.com/users');
    const data = yield res.json();
    yield put(loadDataSuccess(data));
  } catch (err) {
    yield put(failure(err));
  }
}

function * rootSaga () {
  yield takeLatest(REQUEST, loadDataSaga);
}

export default rootSaga;
