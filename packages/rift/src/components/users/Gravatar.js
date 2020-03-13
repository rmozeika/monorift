import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';

export default function Gravatar({
	style,
	imageStyles = {},
	online,
	username
}) {
	const onlineGravatarBorder = online
		? {
				borderWidth: 2,
				borderColor: iconColor
		  }
		: {};

	return (
		<Layout style={style}>
			<Image
				style={{
					minWidth: 20,
					minHeight: 20,
					maxHeight: 40,
					maxWidth: 40,
					height: '100%',
					width: '100%',
					borderRadius: 100,
					...onlineGravatarBorder,
					...imageStyles
				}}
				// source={{ uri: `/gravatar/${username}.png` }}
				source={{ uri: `/gravatar/robertmozeika.png` }}
			/>
		</Layout>
	);
}
