//tabbar
import * as React from 'react';
import { Icon, Layout, Text } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Gravatar from '@components/users/Gravatar';

const iconsMap = {
	['Friends']: 'friends',
	['Users']: 'users',
	['Groups']: 'groups'
	// [undefined]: 'groups'
};

const color = '#F7F9FC';
const activeColor = 'rgb(0, 122, 255)';
const tabColor = 'rgb(21, 26, 48)'; //'#1A2138';
const size = 22;
function TabBar({ state, descriptors, navigation }) {
	const focusedOptions = descriptors[state.routes[state.index].key].options;

	if (focusedOptions.tabBarVisible === false) {
		return null;
	}

	return (
		<View style={{ flexDirection: 'row', backgroundColor: tabColor, height: 50 }}>
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
				const iconName = iconsMap[route.name] || 'notch';
				const foregroundColor = isFocused ? activeColor : color;
				const byFocusedStyles = {
					[true]: {
						tab: styles.activeTab,
						label: styles.activeLabel,
						color: activeColor
					},
					[false]: {
						tab: styles.tab,
						label: styles.label,
						color
					}
				};
				const currentStyles = byFocusedStyles[isFocused];
				const TabIcon = () => {
					if (route.params.gravatar) {
						return (
							<Gravatar
								style={styles.gravatarContainer}
								uri={route.params.gravatar}
								// id={id}
								imageStyles={styles.gravatar}
								isScrolling={false}
							/>
						);
					}

					return (
						<Icon
							color={currentStyles.color}
							size={size}
							style={{}}
							name={iconName || 'notch'}
						/>
					);
				};
				return (
					<TouchableOpacity
						accessibilityRole="button"
						accessibilityStates={isFocused ? ['selected'] : []}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						testID={options.tabBarTestID}
						onPress={onPress}
						onLongPress={onLongPress}
						style={currentStyles.tab}
					>
						{/* <Icon
							color={currentStyles.color}
							size={size}
							style={{}}
							name={iconName}
						/> */}
						<TabIcon />
						<Text style={currentStyles.label}>{label}</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
const tabStyle = {
	flex: 1,
	alignItems: 'center',
	justifyContent: 'space-evenly'
};
const textStyle = {
	fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif`,
	fontSize: 12,
	color
};
const styles = StyleSheet.create({
	tab: {
		...tabStyle
	},
	activeTab: {
		...tabStyle,
		borderTopColor: activeColor,
		borderTopWidth: 2
	},
	label: {
		...textStyle
		// color: color,
	},
	activeLabel: {
		...textStyle,
		color: activeColor
	},
	gravatar: {
		minWidth: 20,
		minHeight: 20,
		maxHeight: 26,
		maxWidth: 26,
		height: '100%',
		width: '100%',
		borderRadius: 0
		// backgroundColor: 'inherit'
	},
	gravatarContainer: {
		flexBasis: 30,
		flex: 0,
		minWidth: 30,
		// marginLeft: 10,
		// backgroundColor: 'inherit',
		justifyContent: 'center'
		// alignItems: 'flex-end'
	}
});
export default TabBar;
