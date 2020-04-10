import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { initialState } from './reducers';
import { audio } from './middleware';
import rootSaga from './sagas';
const bindMiddleware = middleware => {
	if (process.env.NODE_ENV !== 'production') {
		const { composeWithDevTools } = require('redux-devtools-extension');
		return composeWithDevTools(applyMiddleware(...middleware));
	}
	return applyMiddleware(...middleware);
};

function configureStore(initialStates = {}) {
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(
		rootReducer,
		initialState,
		bindMiddleware([sagaMiddleware, audio])
	);

	store.sagaTask = sagaMiddleware.run(rootSaga);

	return store;
}

export default configureStore;
