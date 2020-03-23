import * as React from 'react';
import { Button } from '@ui-kitten/components';
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
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: 'rgb(26, 34, 55)'
						},
						headerTintColor: '#fff',
						headerTitleStyle: {
							fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`,
							fontWeight: '600'
						}
					}}
				>
					<Stack.Screen
						key={'friends'}
						name={'Friends'}
						component={TabNavigation}
						options={{
							headerRight: () => (
								<Button
									onPress={() => alert('This is a button!')}
									title="Call"
									color="#fff"
								/>
							)
						}}
					/>
					<Stack.Screen key={'talk'} name={'Talk'} component={Talk} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
