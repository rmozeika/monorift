import * as React from 'react';
import { useSelector } from 'react-redux';
import IncomingCall from '../IncomingCall';

import {
	Layout,
	Text,
	Button,
	styled,
	withStyles
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row'
	},
	button: {
		margin: 15,
		height: '100%',
		margin: 0,
		flexGrow: 1,
		borderRadius: 0
	},
	buttonRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 0,
		height: '10vh',
		flexDirection: 'row',
		flexBasis: '100%',
		flexGrow: 1
	}
});

const CallActions = ({
	baseHeight,
	onPress,
	themedStyle,
	incomingCall,
	answer,
	reject
}) => {
	const mobile = useSelector(state => state.view.mobile);
	const buttons = [
		{
			name: 'Talk',
			onPress: onPress,
			condition: mobile == true && incomingCall.pending == false,
			status: 'primary',
			key: 'button-talk'
		},
		{
			name: 'Answer',
			onPress: answer,
			condition: incomingCall.pending == true,
			status: 'success',
			key: 'button-answer'
		},
		{
			name: 'Reject',
			onPress: reject,
			condition: incomingCall.pending == true,
			status: 'danger',
			key: 'button-reject'
		}
	];
	// CHANGE THIS condense with func in Users
	const heightMultiplier = incomingCall.pending ? 0.2 : 0.1;
	const derivedHeight = baseHeight * heightMultiplier;
	const activeButtons = buttons.filter(({ condition }) => condition);
	if (activeButtons.length > 0) {
		return (
			<Layout style={[styles.container, { height: derivedHeight }]}>
				{incomingCall.pending && (
					<IncomingCall
						derivedHeight={baseHeight * 0.1}
						name={incomingCall.from.name}
					/>
				)}
				<Layout
					style={[styles.buttonRow, themedStyle, { height: baseHeight * 0.1 }]}
				>
					{activeButtons.map(({ name, onPress, status, key }) => (
						<Button
							style={[styles.button, { height: baseHeight * 0.1 }]}
							status={status}
							onPress={onPress}
							key={key}
						>
							{name}
						</Button>
					))}
				</Layout>
			</Layout>
		);
	}
	return null;
	// return (
	// 	<Layout style={[styles.buttonRow, themedStyle, { height: derivedHeight }]}>
	// 		<Button style={styles.button} onPress={onPress}>
	// 			Talk
	// 		</Button>
	// 		{incomingCall && (
	// 			<Button style={styles.button} status="success" onPress={answer}>
	// 				Answer
	// 			</Button>
	// 		)}
	// 		{incomingCall && (
	// 			<Button style={styles.button} status="danger" onPress={reject}>
	// 				Reject
	// 			</Button>
	// 		)}
	// 	</Layout>
	// );
};
export default CallActions;
