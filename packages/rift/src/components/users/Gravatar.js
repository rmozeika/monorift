import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';
// const styles = StyleSheet.create({
// 	gravatar: {

// 	}
// });
// const GravatarPlaceholder = () => {

// }
function Gravatar({ style = {}, imageStyles = {}, id, isScrolling }) {
	return (
		<Layout style={style}>
			{!isScrolling && (
				<Image
					style={imageStyles}
					source={{ uri: `/gravatar/${id}.png` }}
					// source={{ uri: `/gravatar/robertmozeika.png` }}
				/>
			)}
		</Layout>
	);
}
export default Gravatar;
