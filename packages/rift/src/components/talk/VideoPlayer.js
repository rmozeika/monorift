import * as React from 'react';
import { Layout, Button, ButtonGroup } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import * as Actions from '@actions';

export class VideoPlayer extends React.Component {
	constructor(props) {
		super(props);
		//this.setVideoPlayer();
	}
	componentDidMount() {
		this.props.setVideoPlayer(this.props.videoRef);
	}
	render() {
		const { videoRef } = this.props;
		return (
			<Layout style={styles.row}>
				<video style={videoStyle} autoPlay playsInline ref={videoRef} />
			</Layout>
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
		setVideoPlayer: ref => dispatch(Actions.setVideoPlayer(ref))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
