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
import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore,
  ThemeService,
} from './core/themes';

const middleware = createSagaMiddleware();
const store = createStore({});

const styles = StyleSheet.create({
  parentView: {
    display: "flex",
    height: "100%"
  }, 
  innerViews: { flex: 1 }
})
interface State {
  theme: ThemeKey;
}
// ThemeService.select({'Eva Light': null}, "Eva Light")
export default class App extends React.Component<{}, State> {
  public state: State = {
    theme: 'Eva Light',
  };
  private onSwitchTheme = (theme: ThemeKey) => {
    ThemeStore.setTheme(theme).then(() => {
      this.setState({ theme });
    });
  };
  public render(): React.ReactNode {
    const contextValue: ThemeContextType = {
      currentTheme: this.state.theme,
      toggleTheme: this.onSwitchTheme,
    };
    return (
      <Provider store={store}>
        <ThemeContext.Provider value={contextValue}>
          <ApplicationProvider
            mapping={mapping}
            theme={themes[this.state.theme]}> 
            {/* <View style={styles.parentView}> */}
                {/* <View style={styles.innerViews}> */}
                  <Main />
                {/* </View> */}
                {/* <View style={styles.innerViews}> */}
                 <Homescreen />
                {/* </View> */}
            {/* </View> */}
          </ApplicationProvider>
        </ThemeContext.Provider>
      </Provider>
    );
  }
}
