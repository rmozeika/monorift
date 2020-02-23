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
		// width: '100%',
		flexBasis: '50%',
		height: '100%',
		margin: 0,
		flexGrow: 1
	},
	buttonRow: {
		display: 'flex',
		alignItems: 'center',
		jusatifyContent: 'center',
		margin: 0,
		height: '10vh',
		flexDirection: 'row'
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
			<Button
				style={styles.button}
				// appearance="outline"
				status="danger"
				onPress={onPress}
			>
				Hangup
			</Button>
		</Layout>
	);
};
export default ToCall;
