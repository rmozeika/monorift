import * as React from 'react';
import { Button, Icon } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import TabNavigation from './TabNavigation';
import Talk from './Talk';
import UserScreen from './UserScreen';
import UserList from './UsersList';
import NavBarHeader from './NavBarHeader';
const Stack = createStackNavigator();
const tabColor = 'rgb(26, 34, 55)';

export default class NavigationContiner extends React.Component {
	constructor(props) {
		super(props);
		// this.toCall = this.toCall.bind(this);
	}
	toCall(navigation) {
		debugger;
		navigation.navigate('Talk');
		// this.props.navigation.
	}
	renderSigninIcon(style = { height: 24 }) {
		return <Icon name="sign-in-alt" style={{ ...style }} solid />;
	}

	render() {
		const { children, ...props } = this.props;
		return (
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{
						headerStyle: {
							backgroundColor: tabColor,
							borderBottomColor: tabColor
						},
						headerTintColor: '#fff',
						headerTitleStyle: {
							fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`,
							fontWeight: '600',
							left: 0
						},
						headerTitleContainerStyle: {
							left: 0
						},
						headerRightContainerStyle: {
							paddingHorizontal: 10
						}
					}}
				>
					<Stack.Screen
						key={'friends'}
						name={'Friends'}
						component={TabNavigation}
						options={({ navigation, route }) => ({
							headerTitle: () => <NavBarHeader></NavBarHeader>,
							headerRight: () => (
								<Button
									onPress={() => this.toCall(navigation)}
									title="Call"
									color="#fff"
								>
									Call
								</Button>
							)
						})}
					/>
					<Stack.Screen key={'talk'} name={'Talk'} component={Talk} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
