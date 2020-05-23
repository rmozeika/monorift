import * as React from 'react';
import { Layout, Button, ButtonGroup } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import * as Actions from '@actions';
import MediaControls from '@components/talk/MediaControls';
import CallControls from '@components/talk/CallControls';

import VideoPlayer from '@components/talk/VideoPlayer';

export class Media extends React.Component {
	constructor(props) {
		super(props);
		this.state = { audioControl: null, audioControlsHidden: true };
	}
	// showHideMedia = isHidden => {
	// 	const showHideSettings = {
	// 		hide: {
	// 			onPress: this.hide,
	// 			text: 'Hide'
	// 		},
	// 		show: {
	// 			onPress: this.show,
	// 			text: 'Show'
	// 		}
	// 	};
	// 	const setting = isHidden ? 'show' : 'hide';
	// 	return showHideSettings[setting];
	// };
	// TODO: CHANGE TO ACTIONS
	// play = () => {
	// 	this.props.audioRef.current.play();
	// };
	// stop = () => {
	// 	this.props.audioRef.current.pause();
	// };
	// live = () => {
	// 	this.props.audioRef.current.seekable.end();
	// };
	// hide = () => {
	// 	this.setState({ audioControlsHidden: true });
	// };
	// show = () => {
	// 	this.setState({ audioControlsHidden: false });
	// };
	render() {
		const { videoRef, audioRef } = this.props;
		// REMOVE
		const { audioControlsHidden = true } = this.state;
		// TODO
		const mobile = true;
		const audioStyle = audioControlsHidden
			? { display: 'none' }
			: { margin: 'auto' };
		return (
			<Layout style={styles.container}>
				<VideoPlayer videoRef={videoRef} />
				<Layout style={styles.row}>
					<audio style={audioStyle} id={`audio-1`} controls ref={audioRef}></audio>
				</Layout>
				<CallControls />
				<MediaControls />
				{/* <Layout style={mobile ? styles.floatingControls : styles.buttonRow}> */}
				{/* <Layout style={audioControlsHidden ? styles.floatingControls : styles.floatingContainerOpened}> */}

				{/* <Controls
						startConnection={this.props.startConnection}
						showHideMedia={this.showHideMedia}
						audioControlsHidden={this.state.audioControlsHidden}
						play={this.play}
						stop={this.stop}
					/>
					<Button onPress={this.state.audioControlsHidden ? this.show : this.hide}>Open</Button> */}
				{/* </Layout> */}
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
		flexGrow: 1,
		flexBasis: '45%',
		maxHeight: '50%'
	},
	video: {
		width: '100%'
	}
});
export default Media;
