import * as React from 'react';
import { Button, Icon, Layout } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import CallSelectedButton from '@components/talk/buttons/VideoCallSelected';
const VideoIcon = () => (
	<Icon name={'video'} size={18} color={'rgb(0, 224, 150)'} />
);

const NavUserControls = ({ navigation, toCall }) => {
	return (
		<Layout style={styles.container}>
			<CallSelectedButton />
			<Button
				onPress={() => toCall(navigation)}
				title="video"
				status="success"
				appearance="outline"
				accessoryLeft={VideoIcon}
				style={styles.button}
			>
				{/* video */}
			</Button>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	button: { borderRadius: 100 }
});

export default NavUserControls;
