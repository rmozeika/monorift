import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';
// const styles = StyleSheet.create({
// 	gravatar: {

// 	}
// });
// const GravatarPlaceholder = () => {

// }
function Gravatar({
	uri = false,
	style = {},
	imageStyles = {},
	id,
	isScrolling
}) {
	const source = { uri: uri || `/gravatar/${id}.png` };
	return (
		<Layout style={style}>
			{!isScrolling && (
				<Image
					style={imageStyles}
					source={source}
					// source={{ uri: `/gravatar/robertmozeika.png` }}
				/>
			)}
		</Layout>
	);
}
export default Gravatar;
