import * as React from 'react';
import { useSelector } from 'react-redux';
import IncomingCall from '../talk/IncomingCall';
import AnswerReject from '@containers/talk/HOC/AnswerReject';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export const CallActions = ({ incomingCall, answer, reject }) => {
	// const mobile = useSelector(state => state.view.mobile);
	return (
		<Layout style={styles.container}>
			{incomingCall.map(({ id, username }) => (
				<IncomingCall
					//key={id.toString()}
					key={id}
					name={username}
					answer={() => answer(id)}
					reject={() => reject(id)}
				/>
			))}
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: '100%',
		bottom: 0
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
