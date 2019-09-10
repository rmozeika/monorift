/* global fetch */

import { all, call, delay, put, take, takeLatest, actionChannel } from 'redux-saga/effects'
// import es6promise from 'es6-promise'
import 'isomorphic-unfetch'

import * as Actions from './actions';
import { setConfig } from './constants/ActionTypes';
const { ActionTypes } = Actions;
//  
function * initConfigSaga () {
  // yield take(types.initConfig)
  yield  data = call(loadDataSaga)
  yield put = put(Actions.setConfig);
  // yield put(setConfigSuccess(config));
  // while (true) {
  //   yield put(tickClock(false))
  //   yield delay(1000)
  // }
}
function * loadDataSaga () {
  try {
    const res = yield fetch('https://jsonplaceholder.typicode.com/users')
    const data = yield res.json()
    yield put(loadDataSuccess(data))
  } catch (err) {
    yield put(failure(err))
  }
}

function * rootSaga () {
  yield all([
    takeLatest(ActionTypes.loadData, loadDataSaga),
    takeLatest(ActionTypes.initConfig, initConfigSaga)
  ])
}

export default rootSaga
