import * as React from 'react';
import { useSelector } from 'react-redux';
import AnswerReject from '@containers/talk/HOC/ConnectionAdapter';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export const VideoCallSelected = ({ queued, startConnection }) => {
	// const mobile = useSelector(state => state.view.mobile);
	return (
		<Layout style={styles.container}>
			{queued.length > 0 && (
				<Button
					//key={id.toString()}
					// key={id}
					// name={username}
					style={styles.button}
					status={'primary'}
					onPress={startConnection.video}
				/>
			)}
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		// position: 'absolute',
		// width: '100%',
		// bottom: 0
		margin: 0,
		padding: 0
	},
	userActionContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		// alignSelf: 'flex-end'
		position: 'absolute',
		width: '100%',
		bottom: 0
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

export default AnswerReject(CallActions);
