import * as React from 'react';
// import { Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import 'react-native-gesture-handler';

// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UsersView from '../views/UsersView';
import GroupsView from '../views/GroupsView';
import GroupView from '../views/GroupView';

const Tab = createBottomTabNavigator();

import TabBar from '@components/navigation/TabBar';

class TabNavigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tabs: [
				{
					name: 'Friends',
					key: 'friends',
					initialParams: {
						listType: 'friends'
					},
					condition: true, // possible change this to not render if not signed in
					render: UsersView
				},
				{
					name: 'Users',
					key: 'users',
					initialParams: {
						listType: 'master'
					},
					condition: true, //checked,
					render: UsersView
				},
				{
					name: 'Groups',
					key: 'groups',
					initialParams: {
						listType: 'master'
					},
					condition: true, //checked,
					render: GroupsView,
					renderFunc: this.createGroupsTab
				}
			]
		};
	}
	getActiveTabs = () => {
		const { tabs } = this.state;
		return tabs.filter(({ condition }) => condition);
	};

	// createGroupMembersComponent({listType, })
	createGroupsTab = props => {
		return <GroupsView addTab={this.addTab} {...props} />;
	};
	createGroupTab = props => {
		return <GroupView removeTab={this.removeTab} {...props} />;
	};
	addTab = ({ listType, name, gid, ...extraParams }, navigateTo = true) => {
		this.setState(
			(state, props) => {
				const key = `members_${listType}`;
				const newTabs = [
					{
						name,
						key,
						initialParams: { listType, key, gid, ...extraParams },
						condition: true,
						render: GroupView,
						renderFunc: this.createGroupTab
					}
				];

				const tabs = state.tabs.concat(newTabs);
				return { tabs };
			},
			() => {
				if (navigateTo) this.props.navigation.navigate(name);
			}
		);
	};
	removeTab = ({ key, name }) => {
		const { navigation } = this.props;
		navigation.goBack();
		this.setState((state, props) => {
			const tabs = state.tabs.filter(tab => {
				if (key) {
					return key !== tab.key;
				}
				if (name) {
					return name !== tab.name;
				}
				return true;
			});
			return { tabs };
		});
	};
	TabBar = ({ state, descriptors, navigation }) => {
		const focusedOptions = descriptors[state.routes[state.index].key].options;

		if (focusedOptions.tabBarVisible === false) {
			return null;
		}

		return (
			<View style={{ flexDirection: 'row' }}>
				{state.routes.map((route, index) => {
					const { options } = descriptors[route.key];
					const label =
						options.tabBarLabel !== undefined
							? options.tabBarLabel
							: options.title !== undefined
							? options.title
							: route.name;

					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true
						});

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name);
						}
					};

					const onLongPress = () => {
						navigation.emit({
							type: 'tabLongPress',
							target: route.key
						});
					};

					return (
						<TouchableOpacity
							accessibilityRole="button"
							accessibilityStates={isFocused ? ['selected'] : []}
							accessibilityLabel={options.tabBarAccessibilityLabel}
							testID={options.tabBarTestID}
							onPress={onPress}
							onLongPress={onLongPress}
							style={{ flex: 1 }}
						>
							<Text style={{ color: isFocused ? '#673ab7' : '#222' }}>{label}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	};
	iconsMap = {
		['Friends']: 'friends',
		['Users']: 'users',
		['Groups']: 'group',
		[undefined]: 'group'
	};
	render() {
		// const tabColor = '#161c30';
		const tabColor = 'rgb(21, 26, 48)'; //'#1A2138';
		const { checked } = this.props;
		return (
			<Tab.Navigator
				headerMode={'none'}
				tabBar={props => <TabBar {...props} />}
				// screenOptions={({ route, ...rest }) => ({
				// 	tabBarIcon: ({ focused, color, size }) => {
				// 		let iconName;
				// 		if (route.name === 'Friends') {
				// 			iconName = 'friends';
				// 			// iconName = focused
				// 			//     ? 'ios-information-circle'
				// 			//     : 'ios-information-circle-outline';
				// 		} else if (route.name === 'Users') {
				// 			iconName = 'users';
				// 			// iconName = focused ? 'ios-list-box' : 'ios-list';
				// 		} else if (route.name === 'Groups') {
				// 			iconName = 'groups';
				// 		} else {
				// 			iconName = 'groups';
				// 		}

				// 		// You can return any component that you like here!
				// 		return <Icon color={color} size={size} style={{}} name={iconName} />;
				// 	}
				// 	// cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				// })}
				tabBarOptions={{
					// inactiveBackgroundColor: 'rgba(#F7F9FC, 0.1)',
					// activeBackgroundColor: 'rgba(#F7F9FC, 0.1)',
					style: {
						backgroundColor: tabColor,
						borderTopColor: tabColor
						// fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`
					},
					labelStyle: {
						fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`
					},
					inactiveTintColor: '#F7F9FC',
					activeTintColor: 'rgb(0, 122, 255)'
					// activeTintColor: 'rgb(10, 132, 255)'//'#598BFF' //'#274BDB'
					// labelStyle: {
					// 	color: '#F7F9FC'
					// }
				}}
			>
				{this.getActiveTabs().map(
					({ name, render, key, initialParams, renderFunc }) => {
						let component;
						if (renderFunc) {
							component = renderFunc;
						}
						return (
							<Tab.Screen
								initialParams={initialParams}
								key={key}
								name={name}
								component={component || render}
							/>
						);
					}
				)}
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
