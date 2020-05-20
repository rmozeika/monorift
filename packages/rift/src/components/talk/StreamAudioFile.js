import * as React from 'react';
import { Layout, Text, Button, withStyles } from '@ui-kitten/components';
// import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';

const StreamAudioFile = ({ audioFileRef, fileCall }) => {
	return (
		<Layout
			style={[
				styles.row,
				{
					padding: 0,
					flexGrow: 0,
					flexBasis: 100
					// height: '100%'
				}
			]}
		>
			<Button onPress={fileCall} appearance="outline" status="warning">
				Stream Audio from File
			</Button>
			<audio
				ref={audioFileRef}
				src={`/example.mp3?${Math.random()
					.toString()
					.substr(2)}`}
				type="audio/mpeg"
				controls
				style={{ margin: 'auto' }}
			></audio>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center'
	},
	row: {
		padding: 15,
		width: '100%',
		flexGrow: 1
	},
	callButtonContainer: {
		flexDirection: 'row',
		width: '100%'
	},
	callButton: {
		flexBasis: '50%'
	},
	video: {
		width: '100%'
	}
});
export default StreamAudioFile;
