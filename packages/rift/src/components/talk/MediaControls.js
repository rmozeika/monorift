import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	ButtonGroup
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import withMediaAdapter from '@containers/talk/HOC/ConnectionAdapter';

class MediaControls extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			controlsHidden: true
		};
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
	hide = () => {
		this.setState({ controlsHidden: true });
	};
	show = () => {
		this.setState({ controlsHidden: false });
	};
	render() {
		const { props, state, showHideMedia, show, hide } = this;
		const { play, stop } = props;
		const { controlsHidden } = state;
		return (
			<Layout
				style={
					controlsHidden ? styles.floatingControls : styles.floatingContainerOpened
				}
			>
				<Layout style={styles.innerButtonGroup}>
					<ButtonGroup style={styles.buttonGroup}>
						{/* <Button onPress={this.createAudioContext}>Start</Button> */}
						<Button style={styles.controlButton} onPress={play}>
							Play
						</Button>
						<Button style={styles.controlButton} onPress={stop}>
							Stop
						</Button>
						<ShowHideButton {...showHideMedia(controlsHidden)}></ShowHideButton>
					</ButtonGroup>
				</Layout>
				<Button
					style={styles.openControlsButton}
					onPress={controlsHidden ? show : hide}
				>
					<Text style={styles.openControlsButtonText}>Open</Text>
				</Button>
			</Layout>
		);
	}
}
function ShowHideButton(props) {
	const { onPress, text, style, ...otherProps } = props;
	return (
		<Button
			style={[styles.controlButton, style]}
			onPress={onPress}
			{...otherProps}
		>
			{text}
		</Button>
	);
}
const floatingControlsStyle = {
	position: 'fixed',
	bottom: 10,
	right: 10,
	backgroundColor: 'inherhit',
	clipPath: 'circle(30% at 100% 100%)',
	transition: 'clip-path .2s ease-in-out',
	backgroundColor: 'rgb(51, 102, 255)'
};
const styles = StyleSheet.create({
	floatingControls: {
		...floatingControlsStyle,
		clipPath: 'circle(30% at 100% 100%)'
	},
	floatingContainerOpened: {
		...floatingControlsStyle,
		clipPath: 'circle(75%)'
	},
	openControlsButton: {
		justifyContent: 'flex-end',
		marginRight: 0,
		paddingRight: 0
	},
	openControlsButtonText: {
		justifyContent: 'flex-end',
		marginRight: 0,
		paddingRight: 0
	},
	controlButton: {
		flexGrow: 1,
		flexBasis: 40
	},
	callButtonContainer: {
		height: '100%',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	callButtons: {
		flexGrow: 1,
		flexBasis: '40%',
		borderRadius: 10
	},
	callButtonLeft: {
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0
	},
	callButtonRight: {
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0
	},
	buttonGroup: {
		display: 'flex',
		flexDirection: 'row',
		margin: 0,
		padding: 0,
		height: '70%',
		width: '88%',
		borderRadius: 10,
		// ...buttonGroupBoxShadow,
		backgroundColor: '#F7F9FC'
	},
	innerButtonGroup: {
		display: 'flex',
		// height: '100%',
		flexBasis: '30%',
		width: '100%',
		justifyContent: 'center',
		// justifySelf: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		margin: 10,
		borderRadius: 10,
		backgroundColor: 'inherhit'
		// ...innerButtonBoxShadow
	}
});

export default withMediaAdapter(MediaControls);
