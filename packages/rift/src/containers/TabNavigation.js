import * as React from 'react';
import { Icon } from '@ui-kitten/components';
import { connect } from 'react-redux';
// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserList from './UsersList';

const Tab = createBottomTabNavigator();

class TabNavigation extends React.Component {
	constructor(props) {
		super(props);
		this.getActiveTabs = this.getActiveTabs.bind(this);
	}
	getActiveTabs() {
		const { loggedIn } = this.props;
		const tabs = [
			{
				name: 'Friends',
				condition: loggedIn,
				render: this.createFriendComponent
			},
			{
				name: 'Users',
				condition: true,
				render: this.createUserComponent
			}
		];
		return tabs.filter(({ condition }) => condition);
	}
	createFriendComponent(props) {
		const listType = props.route.name.toLowerCase();
		return <UserList listType={'friends'} containerHeight={500}></UserList>;
	}
	createUserComponent(props) {
		const listType = props.route.name.toLowerCase();
		return <UserList listType={'nonFriends'} containerHeight={500}></UserList>;
	}
	render() {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						debugger; //remove
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
						return <Icon color={'white'} size={12} style={{}} name={iconName} />;
					}
				})}
			>
				{this.getActiveTabs().map(({ name, render }) => {
					return <Tab.Screen name={name} component={render} />;
				})}
			</Tab.Navigator>
		);
	}
}
const mapStateToProps = state => {
	const { loggedIn } = state.auth;
	return {
		loggedIn
	};
};
export default connect(mapStateToProps, {})(TabNavigation);
