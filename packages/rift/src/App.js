import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { Container, Header, Content, Button } from 'native-base';

import "babel-polyfill";

import createStore from "./store";
import Nav from "./components/Nav";

const middleware = createSagaMiddleware();
const store = createStore({});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View>
          <Text >Hello</Text>
            <Button title="Hello"></Button>
        </View>
      </Provider>
    );
  }
}
