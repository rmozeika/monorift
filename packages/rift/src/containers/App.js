import React from "react";
import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import { AppRegistry, StyleSheet, Text, View } from "react-native";
import {
  Container,
  Header,
  Body,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Footer,
  FooterTab
} from "native-base";

import createStore from "../store";
import Nav from "../components/Nav";

const middleware = createSagaMiddleware();
const store = createStore({});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container>
          <Header>
            <Left />
            <Body>
              <Title>Header</Title>
            </Body>
            <Right />
          </Header>
         </Container>
      </Provider>
    );
  }
}
