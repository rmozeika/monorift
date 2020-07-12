import * as React from 'react';
import { Button, Icon, Layout } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import CallSelectedButton from '@components/buttons/VideoCallSelected';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	}
});

export default NavUserControls = ({ navigation, toCall }) => {
	return (
		<Layout style={styles.container}>
			<CallSelectedButton />
			<Button
				onPress={() => toCall(navigation)}
				title="video"
				status="success"
				appearance="outline"
			>
				video
			</Button>
		</Layout>
	);
};
