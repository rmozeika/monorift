import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import '@babel/polyfill';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { enableScreens } from './extraModules/screens.web.js';

import { enableScreens } from 'react-native-screens';

declare global {
	interface Window {
		__DEV__: boolean;
	}
}

window.__DEV__ = false;
enableScreens();

import App from './App';

import createStore from './store';
import config from './auth0_config.json';
import ErrorBoundary from './core/ErrorBoundary';
import {
	ThemeContext,
	ThemeContextType,
	ThemeKey,
	themes,
	ThemeStore,
	ThemeService
} from './core/themes';
// import storybook from './storybook/index.js';
// export default storybook;
const middleware = createSagaMiddleware();
const store = createStore({});

export default class Root extends React.Component<{}, {}> {
	public render(): React.ReactNode {
		return (
			<ErrorBoundary>
				<Provider store={store}>
					<App />
				</Provider>
			</ErrorBoundary>
		);
	}
}
