import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';

import iconFont from 'react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf';
import iconFontSolid from 'react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf';

const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: FontAwesome5_Regular;
}
@font-face {
  src: url(${iconFontSolid});
  font-family: FontAwesome5_Solid;
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
	console.log(Icon);
}

function IconProvider(name) {
	return {
		toReactElement: props => AwesomeIcon({ name, ...props }, props)
	};
}

function AwesomeIcon({ name, style, children, buttonProps, color }, props) {
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
		/>
	);
}

export const AwesomeIconsPack = {
	name: 'awesome',
	icons: createIconsMap()
};

function createIconsMap() {
	return {
		facebook: IconProvider('facebook'),
		google: IconProvider('google'),
		'sign-in-alt': IconProvider('sign-in-alt'),
		'sign-out-alt': IconProvider('sign-out-alt'),
		bars: IconProvider('bars'),
		user: IconProvider('user'),
		circle: IconProvider('circle')
	};
}
