import * as React from 'react';
import { Layout, Text, Button, withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
import * as Actions from '@actions';
import Media from './Media';
import CallActions from '@components/buttons/CallActions';
import StreamAudioFile from '@components/talk/StreamAudioFile';

class Adapter extends React.PureComponent {
	constructor(props) {
		super(props);
		let audioRef = this.props.audioRef || React.createRef();
		let videoRef = React.createRef();
		let selfRef = React.createRef();
		this.audioRef = audioRef;
		this.videoRef = videoRef;
		this.selfRef = selfRef;
		this.audioFileRef = React.createRef();
		this.canvasRef = React.createRef();
		window.audioFileRef = this.audioFileRef;
		window.videoRef = this.videoRef;

		//this.fileCall = this.fileCall.bind(this);
		// this.startConnection = {
		// 	audio: this.call.bind(this),
		// 	video: this.videoCall.bind(this)
		// };
		// this.getDisplayStyle = this.get
	}

	render() {
		const loading = (
			<Layout style={styles.row}>
				<Text>Loading...</Text>
			</Layout>
		);

		return (
			<ScrollView
				style={{
					overflowY: 'scroll',
					// height: '85vh',
					flexGrow: 1,
					flexDirection: 'column'
				}}
				contentContainerStyle={{ flexGrow: 1 }}
			>
				<Layout style={styles.container}>
					<Layout
						style={[
							styles.row,
							{
								padding: 0
								// height: '100%'
							}
						]}
					>
						<Media
							// startConnection={this.props.startConnection}
							videoRef={this.videoRef}
							audioRef={this.audioRef}
						/>
					</Layout>
					{/* <StreamAudioFile fileCall={this.fileCall} audioFileRef={this.audioFileRef} /> */}
					<CallActions />
				</Layout>
			</ScrollView>
		);
	}
}
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

export default Adapter;
