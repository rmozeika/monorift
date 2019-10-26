import React from "react";
import "babel-polyfill";
// import "react-native-svg";
import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { connect } from 'react-redux'
import { mapping, light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, Button, IconRegistry } from 'react-native-ui-kitten';
import { AwesomeIconsPack } from './core/icons'

import Homescreen from './containers/Home';
import NavBar from './containers/NavBar';
import Editor from './containers/Editor';
import { setCode } from './actions';
import { Main }  from './components/tScri';

import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore,
  ThemeService,
} from './core/themes';

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
interface Props {
  setCode: (code: object) => void
}
// ThemeService.select({'Eva Light': null}, "Eva Light")
class App extends React.Component<Props, State> {
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
    this.props.setCode({ name: 'test', text: 'fun'});

    // const socket = io(window.location.origin);
    // socket.on('auth', function(user){
    //   console.log('message: ' + user);
    // });
    return (
        <ThemeContext.Provider value={contextValue}>
          <IconRegistry icons={[AwesomeIconsPack]} />
          <ApplicationProvider
            mapping={mapping}
            theme={themes[this.state.theme]}> 
            {/* <View style={styles.parentView}> */}
                {/* <View style={styles.innerViews}> */}
                  {/* <Main /> */}
                {/* </View> */}
                <NavBar />
                <Editor />
                {/* </View> */}
            {/* </View> */}
          </ApplicationProvider>
        </ThemeContext.Provider>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    // prop: state.prop
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    initCode: (code) => {
      dispatch(setCode(code));
    }
  };
};
export default connect(mapStateToProps, { setCode })(App)