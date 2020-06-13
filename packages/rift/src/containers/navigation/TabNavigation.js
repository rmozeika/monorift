import * as React from 'react';
import { Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
import 'react-native-gesture-handler';

// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import UsersList from '../users/UsersList.web';
import UsersList from '../users/UsersList.native.js';
import GroupTab from '../groups/GroupsTab';

const Tab = createBottomTabNavigator();

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
					// render: this.createFriendComponent
					render: UsersList
				},
				{
					name: 'Users',
					key: 'users',
					initialParams: {
						listType: 'master'
					},
					condition: true, //checked,
					render: UsersList
				},
				{
					name: 'Groups',
					key: 'groups',
					initialParams: {
						listType: 'master'
					},
					condition: true, //checked,
					render: GroupTab,
					renderFunc: this.createGroupsTab
				}
			]
		};
	}
	getActiveTabs = () => {
		const { tabs } = this.state;
		const { loggedIn, checked } = this.props;
		const tabsOld = [
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
					listType: 'master'
				},
				condition: true, //checked,
				render: UsersList
			},
			{
				name: 'Groups',
				key: 'groups',
				initialParams: {
					listType: 'master'
				},
				condition: true, //checked,
				render: GroupTab
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
		return <UsersList listType={'master'} containerHeight={500}></UsersList>;
	}
	// createGroupMembersComponent({listType, })
	createGroupsTab = props => {
		return <GroupTab addTab={this.addTab} {...props} />;
	};
	addTab = ({ listType, name, gid, ...extraParams }) => {
		this.setState((state, props) => {
			const newTabs = [
				{
					name,
					key: 'members' + listType,
					initialParams: { listType, gid, ...extraParams },
					condition: true,
					render: UsersList
				}
			];

			const tabs = state.tabs.concat(newTabs);
			return { tabs };
		});
	};
	render() {
		// const tabColor = '#161c30';
		const tabColor = 'rgb(21, 26, 48)'; //'#1A2138';
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
						} else if (route.name === 'Groups') {
							iconName = 'groups';
						} else {
							iconName = 'groups';
						}

						// You can return any component that you like here!
						return <Icon color={color} size={size} style={{}} name={iconName} />;
					}
					// cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				})}
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
