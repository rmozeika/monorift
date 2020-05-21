import * as React from 'react';
import { Layout, Button, ButtonGroup } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import * as Actions from '@actions';
import Controls from '@components/talk/Controls';
import VideoPlayer from '@components/talk/VideoPlayer';

export class Media extends React.Component {
	constructor(props) {
		super(props);
		this.state = { audioControl: null, audioControlsHidden: true };
	}
	showHideMedia = isHidden => {
		const showHideSettings = {
			hide: {
				onPress: this.hide,
				text: 'Hide'
			},
			show: {
				onPress: this.show,
				text: 'Show'
			}
		};
		const setting = isHidden ? 'show' : 'hide';
		return showHideSettings[setting];
	};
	// TODO: CHANGE TO ACTIONS
	play = () => {
		this.props.audioRef.current.play();
	};
	stop = () => {
		this.props.audioRef.current.pause();
	};
	live = () => {
		this.props.audioRef.current.seekable.end();
	};
	hide = () => {
		this.setState({ audioControlsHidden: true });
	};
	show = () => {
		this.setState({ audioControlsHidden: false });
	};
	render() {
		const { videoRef, audioRef } = this.props;
		const { audioControlsHidden } = this.state;
		const audioStyle = audioControlsHidden
			? { display: 'none' }
			: { margin: 'auto' };
		return (
			<Layout style={styles.container}>
				<VideoPlayer videoRef={videoRef} />
				<Layout style={styles.row}>
					<audio style={audioStyle} id={`audio-1`} controls ref={audioRef}></audio>
				</Layout>
				<Layout style={styles.buttonRow}>
					<Controls
						callFunctions={this.props.callFunctions}
						showHideMedia={this.showHideMedia}
						audioControlsHidden={this.state.audioControlsHidden}
						play={this.play}
						stop={this.stop}
					/>
				</Layout>
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
