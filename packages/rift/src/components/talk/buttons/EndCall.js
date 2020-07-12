import * as React from 'react';
import { useSelector } from 'react-redux';
import ConnectionAdapter from '@containers/talk/HOC/ConnectionAdapter';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles,
	Icon
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { endCall } from '../../../actions';
const HangupIcon = () => <Icon size={22} color="white" name="phone-slash" />;
export const EndCall = ({ active, endCall }) => {
	// const mobile = useSelector(state => state.view.mobile);
	return (
		<Layout style={styles.container}>
			{active.length > -1 && (
				<Button
					// key={id}
					// name={username}
					style={styles.button}
					status={'danger'}
					onPress={() => endCall()}
					accessoryLeft={HangupIcon}
				>
					{/* <Text>Video Call</Text> */}
				</Button>
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
		marginRight: 5,
		borderRadius: 100
		// height: '100%',
		// margin: 0,
		// flexGrow: 1,
		// borderRadius: 0
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

export default ConnectionAdapter(EndCall);
