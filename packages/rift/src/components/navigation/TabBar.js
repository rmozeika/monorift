//tabbar
import * as React from 'react';
import { Icon, Layout, Text } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
const iconsMap = {
	['Friends']: 'friends',
	['Users']: 'users',
	['Groups']: 'groups'
	// [undefined]: 'groups'
};

const color = '#F7F9FC';
const activeColor = 'rgb(0, 122, 255)';
const tabColor = 'rgb(21, 26, 48)'; //'#1A2138';
const size = 18;
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
						<Icon
							color={currentStyles.color}
							size={size}
							style={{}}
							name={iconName}
						/>
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
	}
});
export default TabBar;
