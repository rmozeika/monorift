import * as React from 'react';
import { Layout, Button, ButtonGroup } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import * as Actions from '@actions';

export class VideoPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.setVideoPlayer();
	}
	setVideoPlayer() {
		this.props.setVideoPlayer(this.props.videoRef);
	}
	render() {
		const { videoRef } = this.props;
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
const mapStateToProps = state => {
	return {};
};
const mapDispatchToProps = dispatch => {
	return {
		setVideoPlayer: ref => dispatch(Actions.setVideoPlayer(ref))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
