import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Button, Icon } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import {
	createStackNavigator,
	CardStyleInterpolators,
	TransitionPresets
} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import TabNavigation from './TabNavigation';
import Talk from '../talk/Talk';
import NavBarHeader from './NavBarHeader';
import NavUserControls from '@components/navigation/NavUserControls';
const Stack = createStackNavigator();
const tabColor = 'rgb(21, 26, 48);';

export default class NavigationContiner extends React.Component {
	constructor(props) {
		super(props);
		// this.toCall = this.toCall.bind(this);
	}
	toCall(navigation) {
		navigation.navigate('Talk');
		// this.props.navigation.
	}
	toFriends(navigation) {
		navigation.navigate('Friends');
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
						headerTintColor: '#F7F9FC',
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
								<NavUserControls toCall={this.toCall} navigation={navigation} />
							),
							// ...TransitionPresets.forModalPresentationIOS,
							...TransitionPresets.ModalSlideFromBottomIOS
						})}
					/>
					<Stack.Screen
						key={'talk'}
						name={'Talk'}
						component={Talk}
						options={({ navigation }) => ({
							headerRight: () => {
								return (
									<Button
										style={styles.closeButton}
										status={'danger'}
										onPress={() => this.toFriends(navigation)}
									>
										Close
									</Button>
								);
							},
							title: 'Talk',
							headerTitleStyle: {
								backgroundColor: tabColor
							},
							headerTitleContainerStyle: {
								left: 50,
								backgroundColor: tabColor
							},
							headerRightContainerStyle: {
								marginRight: 10,
								backgroundColor: '#F7F9FC'
							},
							showLabel: false,
							headerRightContainerStyle: { showLabel: false },
							// cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
							...TransitionPresets.ModalSlideFromBottomIOS
						})}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

const styles = StyleSheet.create({
	closeButton: {
		marginRight: 8
	}
});
