import * as React from 'react';
import { Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import 'react-native-gesture-handler';

// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UsersList from '../users/UsersList';

const Tab = createBottomTabNavigator();

class TabNavigation extends React.Component {
	constructor(props) {
		super(props);
	}
	getActiveTabs = () => {
		const { loggedIn, checked } = this.props;
		const tabs = [
			{
				name: 'Friends',
				key: 'friends',
				initialParams: {
					listType: 'friends'
				},
				condition: true, // possible change this to not render if not signed in
				// render: this.createFriendComponent
				render: UsersList
			},
			{
				name: 'Users',
				key: 'users',
				initialParams: {
					listType: 'nonFriends'
				},
				condition: true, //checked,
				render: UsersList
			}
		];
		return tabs.filter(({ condition }) => condition);
	};
	createFriendComponent({ initialParams: { listType } }) {
		// const listType = props.route.name.toLowerCase();
		return <UsersList listType={'friends'} containerHeight={500}></UsersList>;
	}
	createUserComponent({ initialParams: { listType } }) {
		// const listType = props.route.name.toLowerCase();
		return <UsersList listType={'nonFriends'} containerHeight={500}></UsersList>;
	}
	render() {
		const tabColor = '#161c30';
		const { checked } = this.props;
		// if (!this.props.checked) {
		// 	return (null);
		// }
		return (
			<Tab.Navigator
				headerMode={'none'}
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						if (route.name === 'Friends') {
							iconName = 'friends';
							// iconName = focused
							//     ? 'ios-information-circle'
							//     : 'ios-information-circle-outline';
						} else if (route.name === 'Users') {
							iconName = 'users';
							// iconName = focused ? 'ios-list-box' : 'ios-list';
						}

						// You can return any component that you like here!
						return (
							<Icon
								color={'rgb(255, 255, 255)'}
								size={size}
								style={{}}
								name={iconName}
							/>
						);
					}
					// cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				})}
				tabBarOptions={{
					// inactiveBackgroundColor: 'rgba(255, 255, 255, 0.1)',
					// activeBackgroundColor: 'rgba(255, 255, 255, 0.1)',
					style: {
						backgroundColor: tabColor,
						borderTopColor: tabColor
						// fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`
					},
					labelStyle: {
						fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`
					},
					inactiveTintColor: 'white'

					// labelStyle: {
					// 	color: 'white'
					// }
				}}
			>
				{this.getActiveTabs().map(({ name, render, key, initialParams }) => {
					return (
						<Tab.Screen
							initialParams={initialParams}
							key={key}
							name={name}
							component={UsersList}
						/>
					);
				})}
			</Tab.Navigator>
		);
	}
}
const mapStateToProps = state => {
	const { loggedIn, checked } = state.auth;
	return {
		loggedIn,
		checked
	};
};
export default connect(mapStateToProps, {})(TabNavigation);
