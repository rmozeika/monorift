import * as React from 'react';
import { Animated } from 'react-native';
import {
	Layout,
	Button,
	Text,
	StyleService,
	useStyleSheet,
	useTheme
} from '@ui-kitten/components';

// TODO: add this to config
let animationsEnabled = true;

const IncomingCall = ({ name, derivedHeight, answer, reject }) => {
	const [fadeAnim] = React.useState(new Animated.Value(1));
	const [colorAnim] = React.useState(new Animated.Value(0));

	const styles = useStyleSheet(themedStyles);

	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 1000
		}).start();
	}, []);

	const loop = () => {
		const duration = 1000;
		Animated.loop(
			Animated.sequence([
				Animated.timing(colorAnim, {
					toValue: 0,
					duration
				}),
				Animated.timing(colorAnim, {
					toValue: 100,
					duration
				})
			]),
			Animated.timing(colorAnim, {
				toValue: 0,
				duration
			}),
			{
				iterations: 1
			}
		).start(() => {
			loop();
		});
	};

	const theme = useTheme();

	const color = colorAnim.interpolate({
		inputRange: [0, 100],
		outputRange: [theme['color-info-focus'], theme['color-info-hover']]
	});
	if (animationsEnabled) {
		loop();
	}
	const buttons = [
		// {
		// 	name: 'Talk',
		// 	onPress: onPress,
		// 	condition: mobile == true && incomingCall.pending == false,
		// 	status: 'primary',
		// 	key: 'button-talk'
		// },
		{
			name: 'Answer',
			onPress: answer,
			// condition: incomingCall.pending == true,
			status: 'success',
			key: 'button-answer'
		},
		{
			name: 'Reject',
			onPress: reject,
			// condition: incomingCall.pending == true,
			status: 'danger',
			key: 'button-reject'
		}
	];
	const msg = `from ${name}`;
	return (
		<Layout style={[styles.userActionContainer, { height: derivedHeight }]}>
			<Animated.View // Special animatable View
				style={{
					...styles.container,
					height: derivedHeight,
					opacity: fadeAnim,
					backgroundColor: color // Bind opacity to animated value
				}}
			>
				<Layout style={[styles.miniContainer, { backgroundColor: color }]}>
					<Text category={'label'} style={styles.text}>
						Incoming
					</Text>
				</Layout>
				<Layout style={[styles.miniContainer, { backgroundColor: color }]}>
					<Text category={'label'} style={styles.text}>
						{msg}
					</Text>
				</Layout>
			</Animated.View>
			<Layout style={styles.buttonRow}>
				{buttons.map(({ name, onPress, status, key }) => (
					<Button style={styles.button} status={status} onPress={onPress} key={key}>
						{name}
					</Button>
				))}
			</Layout>
		</Layout>
	);
};
const themedStyles = StyleService.create({
	userActionContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'row',
		width: '100%'
	},
	button: {
		margin: 15,
		height: '100%',
		margin: 0,
		flexGrow: 1,
		borderRadius: 0,
		height: '100%'
	},
	buttonRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 0,
		height: '10vh',
		flexDirection: 'row',
		flexBasis: '100%',
		flexGrow: 1,
		backgroundColor: '#3366FF',
		height: '50%'
	},
	container: {
		flexBasis: '100%',
		flexGrow: 1,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center', // stretch if change child to div
		flexDirection: 'row',
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		flexWrap: 'wrap'
	},
	miniContainer: {
		flexBasis: '90%',
		flexGrow: 1,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '50%',
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		backgroundColor: 'inherit'
	},
	text: {
		color: 'color-basic-100'
	}
});
export default IncomingCall;
