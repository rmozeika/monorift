import * as React from 'react';
import { Text, Button, Icon, Layout } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity } from 'react-native';

function onPress() {
	console.log('pressed');
}
function AddRmTest(props) {
	return (
		<Layout>
			<Text>Test</Text>
			<TouchableOpacity onPress={onPress}>Test</TouchableOpacity>
		</Layout>
	);
}

//            {/* <Button onPress={onPress}>Test</Button> */}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	button: {
		flex: 1
	}
});

export default AddRmTest;
