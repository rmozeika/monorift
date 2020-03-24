import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';

export default function Gravatar({
	style = {},
	imageStyles = {},
	online = false,
	username,
	onlineBorderColor = {},
	square = false,
	height = 40,
	heightVh = null
}) {
	const onlineGravatarBorder = online
		? {
				borderWidth: 2,
				borderColor: onlineBorderColor
		  }
		: {};
	const preferredHeight = heightVh || height;
	const width = preferredHeight;
	const layoutStyles = preferredHeight
		? [
				style,
				{
					maxHeight: preferredHeight,
					maxWidth: width,
					aspectRatio: '1:1'
				}
		  ]
		: style;
	// const layoutStyles = styles;
	return (
		<Layout style={style}>
			<Image
				style={{
					minWidth: 20,
					minHeight: 20,
					maxHeight: preferredHeight,
					maxWidth: width,
					height: '100%',
					width: '100%',
					borderRadius: square ? 0 : 100,
					backgroundColor: 'inherit',
					...onlineGravatarBorder,
					...imageStyles
				}}
				source={{ uri: `/gravatar/${username}.png` }}
				// source={{ uri: `/gravatar/robertmozeika.png` }}
			/>
		</Layout>
	);
	// if (true == true) {
	// 	return (
	// 		<Layout style={[style, { maxHeight: 40, maxWidth: 40 }]}>
	// 			<Image
	// 				style={{
	// 					minWidth: 20,
	// 					minHeight: 20,
	// 					maxHeight: 40,
	// 					maxWidth: 40,
	// 					height: '100%',
	// 					width: '100%',
	// 					borderRadius: 100,
	// 					...onlineGravatarBorder,
	// 					...imageStyles
	// 				}}
	// 				source={{ uri: `/gravatar/${username}.png` }}
	// 				// source={{ uri: `/gravatar/robertmozeika.png` }}
	// 			/>
	// 		</Layout>
	// 	);
	// }
	// return (
	// 	<Layout style={style}>
	// 		<Image
	// 			style={{
	// 				minWidth: 20,
	// 				minHeight: 20,
	// 				maxHeight: 40,
	// 				maxWidth: 40,
	// 				height: '100%',
	// 				width: '100%',
	// 				borderRadius: 100,
	// 				...onlineGravatarBorder,
	// 				...imageStyles
	// 			}}
	// 			source={{ uri: `/gravatar/${username}.png` }}
	// 			// source={{ uri: `/gravatar/robertmozeika.png` }}
	// 		/>
	// 	</Layout>
	// );
}
