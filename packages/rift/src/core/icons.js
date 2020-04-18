import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import IconFeather from 'react-native-vector-icons/Feather';

import iconFont from 'react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf';
import iconFontSolid from 'react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf';
import iconFontBrands from 'react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf';

import iconFontFeather from 'react-native-vector-icons/Fonts/Feather.ttf';
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: FontAwesome5_Regular;
}
@font-face {
  src: url(${iconFontSolid});
  font-family: FontAwesome5_Solid;
}
@font-face {
	src: url(${iconFontBrands});
	font-family: FontAwesome5_Brands;
}
@font-face {
	src: url(${iconFontFeather});
	font-family: Feather;
}`;
if (Platform.OS == 'web') {
	const style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) {
		style.styleSheet.cssText = iconFontStyles;
	} else {
		style.appendChild(document.createTextNode(iconFontStyles));
	}
	document.head.appendChild(style);
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
const defaultStyle = StyleSheet.create({
	height: 40,
	tintColor: 'white'
});
function AwesomeIcon(
	{ name, style, children, size, buttonProps, color, ...iconProps },
	props
) {
	const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style); //StyleSheet.flatten([defaultStyle, style]);
	if (name == 'google' || name == 'sign-in-alt') {
		debugger; //remove
		// console.log('ICON HERE', height, tintColor);
	}
	if (children || buttonProps) {
		return (
			<Icon5.Button
				name={name}
				color={tintColor}
				{...buttonProps}
				// iconStyle={iconStyle}
				iconStyle={style}
			>
				{children}
			</Icon5.Button>
		);
	}

	return (
		<Icon5
			name={name}
			size={size || height}
			color={color || tintColor}
			style={style}
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
		users: IconProvider('users'),
		circle: IconProvider('circle'),
		friend: IconProvider('user-plus'),
		friends: IconProvider('user-friends'),

		// activity: FeatherIconProvider('activity')
		activity: FeatherIconProvider('smartphone'),
		x: FeatherIconProvider('x'),
		'friend-request': IconProvider('user-check'),
		'pointed-right': IconProvider('angle-double-right'),
		'caret-down': IconProvider('caret-down'),
		phone: IconProvider('phone'),
		alert: IconProvider('info-circle'),
		// facebook: IconProvider('facebook'),
		// google: IconProvider('google'),
		github: IconProvider('github'),
		'google-play': IconProvider('google-play')
		// activity: IconProvider('user-plus'),
	};
}
