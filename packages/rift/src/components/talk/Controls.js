import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	ButtonGroup
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

class Controls extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			showHideMedia,
			callFunctions,
			play,
			stop,
			audioControlsHidden
		} = this.props;
		return (
			<Layout style={styles.container}>
				<Layout style={styles.outerButtonGroup}>
					<Layout style={styles.innerButtonGroup}>
						<ButtonGroup style={styles.buttonGroup}>
							{/* <Button onPress={this.createAudioContext}>Start</Button> */}
							<Button style={styles.controlButton} onPress={play}>
								Play
							</Button>
							<Button style={styles.controlButton} onPress={stop}>
								Stop
							</Button>
							<ShowHideButton {...showHideMedia(audioControlsHidden)}></ShowHideButton>
						</ButtonGroup>
					</Layout>
					<Layout style={[styles.innerButtonGroup, { flexBasis: '50%' }]}>
						<Layout style={[styles.callButtonContainer, { boxShadow: 'none' }]}>
							<Button
								style={[styles.callButtons, styles.callButtonLeft]}
								onPress={callFunctions.audio}
							>
								Audio Call
							</Button>
							<Button
								style={[styles.callButtons, styles.callButtonRight]}
								onPress={callFunctions.video}
							>
								Video Call
							</Button>
						</Layout>
					</Layout>
				</Layout>
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

const outerButtonGroupBoxShadow = {
	boxShadow: `
			inset 5px 5px 5px -15px rgba(0,0,0,0.1), 
			inset -5px -5px 7px -15px rgba(255, 255, 255, 0.4), 
			-5px -5px 16px rgba(255, 255,255, 0.1), 
			15px 15px 10px rgba(0,0,0,0.5)
		`
};
const controlButtonBoxShadow = `inset 10px 10px 10px rgba(0,0,0,.1), inset -10px -10px 5px rgba(0,0,0,.1), inset -10px 10px 5px rgba(0,0,0,.1), inset 10px -10px 10px rgba(0,0,0,.1)`;
const buttonGroupBoxShadow = {
	boxShadow: `
		rgba(0, 0, 0, 0.9) 5px 5px 5px -15px, 
		rgba(255, 255, 255, 0.2) -7px -7px 16px -10px, 
		rgba(0, 0, 0, 4) 10px 10px 16px 0px
		`,
	borderWidth: 0
};
const innerButtonBoxShadow = {
	boxShadow: `
	rgba(255, 255, 255, 0.1) -5px -5px 5px -1px inset, 
	rgba(0, 0, 0, 0.2) 5px 5px 5px -1px inset
	`
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
		flexGrow: 1
	},
	controlButton: {
		flexGrow: 1,
		flexBasis: 40,
		boxShadow: controlButtonBoxShadow
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
		boxShadow: controlButtonBoxShadow,
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
		...buttonGroupBoxShadow,
		backgroundColor: 'white'
	},
	innerButtonGroup: {
		display: 'flex',
		// height: '100%',
		flexBasis: '30%',
		width: '100%',
		justifyContent: 'center',
		justifySelf: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		margin: 10,
		borderRadius: 10,
		...innerButtonBoxShadow
	},
	outerButtonGroup: {
		backgroundColor: 'inherit',
		// flexGrow: 1,
		// flexBasis: '40%',
		width: '95%',
		height: '95%',
		display: 'flex',
		justifyContent: 'center',
		justifySelf: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 4,
		padding: 15,
		...outerButtonGroupBoxShadow
	}
});

export default Controls;
