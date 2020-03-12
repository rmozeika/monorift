import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import IconFeather from 'react-native-vector-icons/Feather';

import iconFont from 'react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf';
import iconFontSolid from 'react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf';
import iconFontFeather from 'react-native-vector-icons/Fonts/Feather.ttf';
const font5fam = Icon.getFontFamily();
console.log(font5fam);
debugger;
const FeatherFontFam = IconFeather.getFontFamily();
debugger; //remove
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: FontAwesome5_Regular;
}
@font-face {
  src: url(${iconFontSolid});
  font-family: FontAwesome5_Solid;
}
@font-face {
	src: url(${iconFontFeather});
	font-family: Feather;
  }
`;
if (Platform.OS == 'web') {
	const style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) {
		style.styleSheet.cssText = iconFontStyles;
	} else {
		style.appendChild(document.createTextNode(iconFontStyles));
	}
	document.head.appendChild(style);
	console.log(Icon);
}

function IconProvider(name) {
	return {
		toReactElement: props => AwesomeIcon({ name, ...props }, props)
	};
}
function FeatherIconProvider(name) {
	return {
		toReactElement: props => FeatherIcon({ name, ...props }, props)
	};
}
function FeatherIcon({
	name,
	style,
	children,
	buttonProps,
	color,
	...iconProps
}) {
	const { ...iconStyle } = StyleSheet.flatten(style);
	debugger; //remove
	// const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
	// return (<IconFeather name="activity" size={20} color="#4F8EF7" />);
	return (
		<IconFeather
			name={name}
			// size={height}
			color={color}
			style={iconStyle}
			{...iconProps}
		/>
	);
}
function AwesomeIcon(
	{ name, style, children, buttonProps, color, ...iconProps },
	props
) {
	console.log(props);
	const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);

	if (children || buttonProps) {
		return (
			<Icon5.Button
				name={name}
				color={tintColor}
				{...buttonProps}
				iconStyle={iconStyle}
			>
				{children}
			</Icon5.Button>
		);
	}
	return (
		<Icon5
			name={name}
			size={height}
			color={color || tintColor}
			style={iconStyle}
			{...iconProps}
		/>
	);
}

export const AwesomeIconsPack = {
	name: 'awesome',
	icons: createIconsMap()
};

export const FeatherIconsPack = {
	name: 'feather',
	icons: createFeatherIconsMap()
};
function createFeatherIconsMap() {
	return {
		activity: FeatherIconProvider('activity')
	};
}

function createIconsMap() {
	return {
		facebook: IconProvider('facebook'),
		google: IconProvider('google'),
		'sign-in-alt': IconProvider('sign-in-alt'),
		'sign-out-alt': IconProvider('sign-out-alt'),
		bars: IconProvider('bars'),
		user: IconProvider('user'),
		circle: IconProvider('circle'),
		friend: IconProvider('user-plus'),
		// activity: FeatherIconProvider('activity')
		activity: FeatherIconProvider('smartphone')

		// activity: IconProvider('user-plus'),
	};
}
