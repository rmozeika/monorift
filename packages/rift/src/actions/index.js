import * as types from './types';

export const ActionTypes = types;
export const setConfig = config => ({
  type: types.setConfig,
  config
});

export function loadData () {
  return { type: types.loadData }
}

export function loadDataSuccess (data) {
  return {
    type: types.loadDataSuccess,
    data
  }
}
// export const getConfig = () => dispatch => {
//   // shop.getConfig(config => {
//   //   dispatch(setConfig(config));
//   // });
//     dispatch(setConfig({ needsToComeFrom: 'somewhere' }));
// };

export const getConfig = () => ({
    type: types.getConfig
});

export const initConfig = () => ({
    type: types.initConfig
})