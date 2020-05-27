import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	ButtonGroup
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import withConnectionAdapter from '@containers/talk/HOC/ConnectionAdapter';

class CallControls extends React.Component {
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

		const { startConnection } = props;
		const { controlsHidden } = state;

		return (
			<Layout
				style={
					controlsHidden ? styles.floatingControls : styles.floatingContainerOpened
				}
			>
				{/* <Layout style={styles.container}> */}
				{/* <Layout style={styles.outerButtonGroup}> */}
				<Layout style={[styles.innerButtonGroup, { flexBasis: '50%' }]}>
					<Layout style={styles.callButtonContainer}>
						<Button
							style={[styles.callButtons, styles.callButtonLeft]}
							onPress={startConnection.audio}
						>
							Audio Call
						</Button>
						<Button
							style={[styles.callButtons, styles.callButtonRight]}
							onPress={startConnection.video}
						>
							Video Call
						</Button>
					</Layout>
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

const floatingControlsStyle = {
	position: 'fixed',
	bottom: 10,
	left: 10,
	// backgroundColor: 'inherhit',
	clipPath: 'circle(30% at 0% 100%)',
	transition: 'clip-path .2s ease-in-out',
	backgroundColor: 'rgb(51, 102, 255)'
};
const styles = StyleSheet.create({
	floatingControls: {
		...floatingControlsStyle
	},
	floatingContainerOpened: {
		...floatingControlsStyle,
		clipPath: 'circle(75%)'
	},
	openControlsButton: {
		justifyContent: 'flex-start',
		marginLeft: 0,
		paddingLeft: 0
	},
	openControlsButtonText: {
		justifyContent: 'flex-start',
		marginLeft: 0,
		paddingLeft: 0
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
		backgroundColor: '#F7F9FC'
	},
	innerButtonGroup: {
		display: 'flex',
		flexBasis: '30%',
		width: '100%',
		justifyContent: 'center',
		// justifySelf: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		margin: 10,
		borderRadius: 10
		// backgroundColor: 'inherhit'
	}
});

export default withConnectionAdapter(CallControls);
