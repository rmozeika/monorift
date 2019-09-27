import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import Homescreen from './containers/Home';
import "babel-polyfill";
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider } from 'react-native-ui-kitten';
import createStore from "./store";
// import Nav from "./components/Nav";
import { Main }  from './components/tScri';
const middleware = createSagaMiddleware();
const store = createStore({});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
      <ApplicationProvider
        mapping={mapping}
        theme={lightTheme}
      >
          <Main />
          <Homescreen />
        </ApplicationProvider>
      </Provider>
    );
  }
}
