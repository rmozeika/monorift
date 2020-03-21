import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import Call from './Call';
const Stack = createStackNavigator();

export default class NavigationContiner extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { children, ...props } = this.props;
		return (
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Home" component={Call} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
