import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import TabNavigation from './TabNavigation';
import Talk from './Talk';
import UserScreen from './UserScreen';
import UserList from './UsersList';

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
					<Stack.Screen name={'Friends'} component={TabNavigation} />
					<Stack.Screen name={'Talk'} component={Talk} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
