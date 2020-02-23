import * as React from 'react';

import {
	Layout,
	Text,
	Button,
	styled,
	withStyles
} from 'react-native-ui-kitten';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	button: {
		// margin: 8,
		margin: 15,
		width: '100%',
		height: '100%',
		margin: 0
	},
	buttonRow: {
		display: 'flex',
		alignItems: 'center',
		jusatifyContent: 'center',
		margin: 0,
		height: '10vh'
	}
});

const ToCall = ({ buttonHeight, onPress, themedStyle }) => {
	return (
		<Layout style={[styles.buttonRow, themedStyle, { height: buttonHeight }]}>
			<Button
				style={styles.button}
				// appearance="outline"
				onPress={onPress}
			>
				Talk
			</Button>
		</Layout>
	);
};
export default ToCall;
