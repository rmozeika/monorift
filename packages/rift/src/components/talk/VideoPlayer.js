import * as React from 'react';
import { Layout, Button, ButtonGroup } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

export class VideoPlayer extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Layout style={styles.row}>
				<video
					style={{ width: '100%', margin: 'auto' }}
					autoPlay
					playsInline
					ref={videoRef}
				/>
			</Layout>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		// height: '100%',
		justifyContent: 'space-between'
	},
	row: {
		width: '100%',
		flexGrow: 1
	},
	buttonRow: {
		width: '100%',
		margin: 8,
		flexGrow: 1,
		flexBasis: '45%',
		maxHeight: '50%'
	},
	video: {
		width: '100%'
	}
});

export default VideoPlayer;
