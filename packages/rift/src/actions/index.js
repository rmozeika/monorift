import * as types from './types';

export const ActionTypes = types;
export const setConfig = config => ({
  type: types.setConfig,
  config
});

export function loadData () {
  return { type: types.loadData };
}

export function loadDataSuccess (data) {
  return {
    type: types.loadDataSuccess,
    data
  };
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
});

export const getCode = () => ({
    type: types.GET_CODE
});

export const setCode = (code) => ({
  type: types.SET_CODE,
  code
});

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`;
		return acc;
	}, {});
}

export const LOGIN = createRequestTypes('LOGIN');
export const AUTH = { LOGIN: { ...LOGIN }}
export const CODE = { ...createRequestTypes('CODE'), ...types.code };
export const REPO = createRequestTypes('REPO');
export const code = {
  request: login => action(CODE[REQUEST], {login}),
  success: (login, response) => action(CODE[SUCCESS], {login, response}),
  failure: (login, error) => action(CODE[FAILURE], {login, error}),
};
// export const REPO = createRequestTypes('REPO');
// export const STARRED = createRequestTypes('STARRED');
// export const STARGAZERS = createRequestTypes('STARGAZERS');

