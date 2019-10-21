import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import "babel-polyfill";

import App from './App';
import { Auth0Provider } from './containers/auth0';

import createStore from "./store";
import config from './auth0_config.json';
import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore,
  ThemeService,
} from './core/themes';

// const middleware = createSagaMiddleware();
const store = createStore({});

const onRedirectCallback = function(appState: any): void {
    window.history.replaceState(
        {},
        document.title,
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      );
    return;
}
export default class Root extends React.Component<{}, {}> {
    public render(): React.ReactNode {
        return (
            <Provider store={store}>
                <Auth0Provider
                    domain={config.domain}
                    client_id={config.clientId}
                    redirect_uri={window.location.origin + '/auth/callback'}
                    // onRedirectCallback={onRedirectCallback}
                >
                    <App />
                </Auth0Provider>
            </Provider>
        )
    }
}