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
const VideoIcon = () => <Icon name={'video'} size={22} color={'white'} />;
export const VideoCallSelected = ({ queued, startConnection }) => {
	// const mobile = useSelector(state => state.view.mobile);
	return (
		<Layout style={styles.container}>
			{queued.length > 0 && (
				<Button
					// key={id}
					// name={username}
					style={styles.button}
					status={'success'}
					onPress={startConnection.video}
					// accessoryLeft={VideoIcon}
				>
					<Text>Video Call</Text>
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
		marginRight: 5
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

export default ConnectionAdapter(VideoCallSelected);
