import * as React from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

import {
	Layout,
	Text,
	Button,
	styled,
	Input,
	Icon,
	StyleService,
	useStyleSheet,
	useTheme
} from '@ui-kitten/components';
import Spinner from '@components/animations/Spinner';
const QuickCall = ({ startCall, endCall, checked, calling, connected }) => {
	const styles = useStyleSheet(themedStyles);

	const theme = useTheme();
	const [fadeAnim] = React.useState(new Animated.Value(1));
	const [colorAnim] = React.useState(new Animated.Value(0));
	React.useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 1000
		}).start();
	}, []);
	const color = colorAnim.interpolate({
		inputRange: [0, 100],
		outputRange: [theme['color-success-500'], theme['color-success-300']]
	});
	if (connected) {
		return (
			<Layout style={[styles.container, { backgroundColor: 'rgb(0, 224, 150)' }]}>
				<TouchableOpacity
					onPress={endCall}
					style={[
						styles.touchableContainer,
						{ backgroundColor: 'rgb(0, 224, 150)' }
					]}
				>
					<Icon style={{}} size={22} name="microphone" color={'#F7F9FC'}></Icon>
					<Text style={[{ color: '#F7F9FC' }, styles.statusText]}>Connected</Text>
				</TouchableOpacity>
			</Layout>
		);
	}
	if (!calling) {
		return (
			<TouchableOpacity onPress={startCall} style={styles.touchableContainer}>
				<Icon style={{}} size={22} name="phone" color={'rgb(0, 224, 150)'}></Icon>
				{/* <Icon style={{}} size={22} name="phone" color={theme['color-primary-500']}></Icon> */}
				<Text style={[{ color: theme['color-success-500'] }, styles.statusText]}>
					Quick Connect
				</Text>
			</TouchableOpacity>
		);
	}

	const loop = () => {
		const duration = 500;
		Animated.loop(
			Animated.sequence([
				Animated.timing(colorAnim, {
					toValue: 0,
					duration
				}),
				Animated.timing(colorAnim, {
					toValue: 100,
					duration
				}),
				Animated.timing(colorAnim, {
					toValue: 0,
					duration
				})
			]),

			{
				iterations: 1
			}
		).start(() => {
			loop();
		});
	};

	loop();
	// TODO: cancel action
	return (
		<Animated.View // Special animatable View
			style={{
				...styles.container,
				opacity: fadeAnim,
				backgroundColor: color // Bind opacity to animated value
			}}
		>
			<TouchableOpacity onPress={endCall} style={styles.touchableContainer}>
				<Spinner
					size={22}
					render={spinner => <SpinnerIcon spinner={spinner} />}
				></Spinner>
				<Text style={[{ color: '#F7F9FC' }, styles.statusText]}>Calling...</Text>
			</TouchableOpacity>
		</Animated.View>
	);
};
const SpinnerIcon = ({ spinner }) => (
	<Icon style={{}} size={spinner.size} name="spinner" color={'#F7F9FC'} />
);

const themedStyles = StyleService.create({
	container: {
		flexBasis: '100%',
		flexGrow: 1,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center', // stretch if change child to div
		// flexDirection: 'row',
		//borderRadius: 10,
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
	},
	touchableContainer: {
		flexBasis: 30,
		height: 30,
		//borderRadius: 60,
		// backgroundColor: 'rgb(0, 224, 150)',
		backgroundColor: 'transparent', //'rgba(44, 255, 187, 0.05)',
		justifyItems: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 0
	},
	statusText: {
		fontSize: 10,
		lineHeight: 10,
		marginTop: 5
	}
});

export default QuickCall;
