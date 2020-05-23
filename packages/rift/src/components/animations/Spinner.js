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

class Spinner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spinValue: new Animated.Value(0)
		};
	}
	render() {
		const { spinValue } = this.state;
		const { size } = this.props;
		Animated.loop(
			Animated.timing(spinValue, {
				toValue: 1,
				duration: 1200,
				easing: Easing.cubic
				// useNativeDriver: true // To make use of native driver for performance
			})
		).start();

		const spin = spinValue.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '360deg']
		});
		return (
			<Animated.View
				style={{
					transform: [{ rotate: spin }],
					height: size,
					width: size,
					padding: 0,
					margin: 0,
					alignContent: 'center',
					alignItems: 'center',
					justifyItems: 'center'
				}}
			>
				{this.props.render({ ...this.state, size })}
			</Animated.View>
		);
	}
}
const Spinner2 = ({ size = 22, ...props }) => {
	const [spinValue] = React.useState(new Animated.Value(0));

	// First set up animation
	Animated.loop(
		Animated.timing(spinValue, {
			toValue: 1,
			duration: 1200,
			easing: Easing.cubic
			// useNativeDriver: true // To make use of native driver for performance
		})
	).start();

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg']
	});
	return (
		<Animated.View
			style={{
				transform: [{ rotate: spin }],
				height: size,
				width: size,
				padding: 0,
				margin: 0,
				alignContent: 'center',
				alignItems: 'center',
				justifyItems: 'center'
			}}
		>
			{/* {props.render} */}
			{props.children}
			{/* <Icon style={{}} size={size} name="spinner" color={'#F7F9FC'} /> */}
		</Animated.View>
	);
};

export default Spinner;
