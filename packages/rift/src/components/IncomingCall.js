import * as React from 'react';
import { Animated } from 'react-native';
import {
	Layout,
	Text,
	StyleService,
	useStyleSheet,
	useTheme
} from 'react-native-ui-kitten';
const IncomingCall = ({ name, derivedHeight }) => {
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
	loop();

	const msg = `from ${name}`;
	return (
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
	);
};
const themedStyles = StyleService.create({
	container: {
		flexBasis: '100%',
		flexGrow: 1,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center', // stretch if change child to div
		flexDirection: 'row',
		borderRadius: 10,
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
		// borderRadius: 10,
		height: '50%',
		borderBottomRightRadius: 0,
		borderBottomLeftRadius: 0,
		// backgroundColor: 'color-primary-transparent-200',
		backgroundColor: 'inherit'
		// margin: 5
	},
	text: {
		// color: 'color-primary-100'
		color: 'color-basic-100'
	}
});
export default IncomingCall;
