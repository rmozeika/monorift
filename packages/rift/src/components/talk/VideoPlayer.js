import * as React from 'react';
import { Layout, Button, ButtonGroup, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, View, findNodeHandle } from 'react-native';
import * as Actions from '@actions';
// import { f } from 'react-native';

export class VideoPlayer extends React.Component {
	constructor(props) {
		super(props);
		//this.container
		//this.setVideoPlayer();
	}
	setNativeProps = (nativeProps) => {
		this._root.setNativeProps(nativeProps);
	}
	setRefs = () => {
		this.props.setVideoPlayer(this.props.videoRef, this._root);
	}
	setContainerRef = (component) => {
		this._root = component;
	}
	componentDidMount() {
		console.log(this.props.containerRef);
		//const comp =findNodeHandle(this._root);
		const container_dom = findNodeHandle(this.props.containerRef.current);
		this.props.setVideoPlayer(this.props.videoRef, container_dom);
	}
	render() {
		const { videoRef, containerRef } = this.props;
		return (
			<View ref={this.setContainerRef} style={styles.row}>
				<video style={videoStyle} autoPlay playsInline ref={videoRef} />
				<Layout ref={containerRef}><Text>Extra videos</Text></Layout>
				<Button onPress={this.setRefs}>setRefs</Button>
			</View>
		);
	}
}
// Stylesheet doesnt work with some web componenets
const videoStyle = {
	// width: '100%',
	// margin: 'auto',
	// objectFit: 'contain',
	objectFit: 'cover',
	flexGrow: 1,
	flexBasis: '100%'
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		// height: '100%',
		justifyContent: 'space-between'
	},
	row: {
		width: '100%',
		flexGrow: 1,
		flexBasis: '100%'
	},
	video: {
		width: '100%',
		margin: 'auto'
	}
});
const mapStateToProps = state => {
	return {};
};
const mapDispatchToProps = dispatch => {
	return {
		setVideoPlayer: (ref, containerRef) => dispatch(Actions.setVideoPlayer(ref, containerRef))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
