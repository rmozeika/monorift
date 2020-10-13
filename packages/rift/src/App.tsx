import React from 'react';
import '@babel/polyfill';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { mapping, light as lightTheme } from '@eva-design/eva';
import {
	ApplicationProvider,
	Button,
	IconRegistry,
	Layout
} from '@ui-kitten/components';

import { ApolloProvider } from '@apollo/client';

import {
	AwesomeIconsPack
	// FeatherIconsPack
} from './core/icons';
import content from './core/themes/mapping.json';

import Navigation from './containers/navigation/Navigation';
import About from './containers/misc/About';
import Admin from './containers/misc/Admin';

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

import { client } from './core/api/apollo';

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
		// CHANGE THIS REMOVE ROUTER
		return (
			<ThemeContext.Provider value={contextValue}>
				<IconRegistry icons={[AwesomeIconsPack]} />
				<ApplicationProvider
					mapping={mapping}
					theme={themes[this.state.theme]}
					customMapping={content}
				>
					{/* 
					// @ts-ignore */}
					<ApolloProvider client={client}>
						<View style={styles.parentView}>
							<Router>
								<Switch>
									<Route exact path="/about">
										<About />
									</Route>
									<Route exact path="/admin">
										<Admin />
									</Route>
									<Route exact path="/">
										<Navigation />
									</Route>
								</Switch>
							</Router>
						</View>
					</ApolloProvider>
				</ApplicationProvider>
			</ThemeContext.Provider>
		);
	}
}
const links = () => (
	<Layout>
		<Layout>
			<Link to="/">Home</Link>
		</Layout>
		<Layout>
			<Link to="/admin">Admin</Link>
		</Layout>
		<Layout>
			<Link to="/about">About</Link>
		</Layout>
	</Layout>
);
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
