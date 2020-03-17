import React from 'react';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { mapping, light as lightTheme } from '@eva-design/eva';
import {
	ApplicationProvider,
	Button,
	IconRegistry,
	Layout
} from '@ui-kitten/components';
import {
	AwesomeIconsPack
	// FeatherIconsPack
} from './core/icons';

import NavBar from './containers/NavBar';
import Editor from './containers/Editor';
import About from './containers/About';

import Call from './containers/Call';

import { setCode, setIsMobile } from './actions';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import {
	ThemeContext,
	ThemeContextType,
	ThemeKey,
	themes,
	ThemeStore,
	ThemeService
} from './core/themes/index';

const styles = StyleSheet.create({
	parentView: {
		display: 'flex',
		height: '100%'
	},
	innerViews: { flex: 1 }
});
interface State {
	theme: ThemeKey;
}
interface Props {
	initCode: (code: object) => void;
	setIsMobile: (isMobile: boolean) => void;
}
class App extends React.Component<Props, State> {
	public constructor(props) {
		super(props);
		console.log(' setting mobile');
		const isMobile = window.innerWidth <= 600;
		this.props.setIsMobile(isMobile);
	}
	public state: State = {
		theme: 'Eva Dark'
	};
	private onSwitchTheme = (theme: ThemeKey) => {
		ThemeStore.setTheme(theme).then(() => {
			this.setState({ theme });
		});
	};
	public render(): React.ReactNode {
		const contextValue: ThemeContextType = {
			currentTheme: this.state.theme,
			toggleTheme: this.onSwitchTheme
		};
		return (
			<ThemeContext.Provider value={contextValue}>
				<IconRegistry icons={[AwesomeIconsPack]} />
				<ApplicationProvider mapping={mapping} theme={themes[this.state.theme]}>
					<View style={styles.parentView}>
						<Router>
							<NavBar />
							<Switch>
								<Route path="/about">
									<About />
								</Route>
								<Route path="/">
									<Call />
								</Route>
							</Switch>
						</Router>
					</View>
				</ApplicationProvider>
			</ThemeContext.Provider>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {};
};
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		initCode: code => {
			dispatch(setCode(code));
		},
		setIsMobile: isMobile => {
			dispatch(setIsMobile(isMobile));
		}
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
