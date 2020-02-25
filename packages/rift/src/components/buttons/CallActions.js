import * as React from 'react';
import { useSelector } from 'react-redux';

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
		// flexBasis: '50%',
		height: '100%',
		margin: 0,
		flexGrow: 1,
		borderRadius: 0
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

const CallActions = ({
	buttonHeight,
	onPress,
	themedStyle,
	callIncoming,
	answer,
	reject,
	userCalling
}) => {
	const mobile = useSelector(state => state.view.mobile);
	debugger;
	const buttons = [
		{
			name: 'Talk',
			onPress: onPress,
			condition: mobile == true,
			status: 'primary'
		},
		{
			name: 'Answer',
			onPress: answer,
			condition: callIncoming == true,
			status: 'success'
		},
		{
			name: 'Reject',
			onPress: reject,
			condition: callIncoming == true,
			status: 'danger'
		}
	];
	const activeButtons = buttons.filter(({ condition }) => condition);
	if (activeButtons.length > 0) {
		return (
			<Layout style={[styles.buttonRow, themedStyle, { height: buttonHeight }]}>
				{activeButtons.map(({ name, onPress, status }) => (
					<Button style={styles.button} status={status} onPress={onPress}>
						{name}
					</Button>
				))}
			</Layout>
		);
	}
	return (
		<Layout style={[styles.buttonRow, themedStyle, { height: buttonHeight }]}>
			<Button
				style={styles.button}
				// appearance="outline"
				onPress={onPress}
			>
				Talk
			</Button>
			{callIncoming && (
				<Button
					style={styles.button}
					// appearance="outline"
					status="success"
					onPress={answer}
				>
					Answer
				</Button>
			)}
			{callIncoming && (
				<Button
					style={styles.button}
					// appearance="outline"
					status="danger"
					onPress={reject}
				>
					Reject
				</Button>
			)}
		</Layout>
	);
};
export default CallActions;
