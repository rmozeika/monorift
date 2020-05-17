import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Icon, Layout, Button } from '@ui-kitten/components';

export const Icons = props => {
	return (
		<Layout style={styles.iconContainer}>
			<Icon
				size={12}
				name={'facebook'}
				color={'blue'}
				style={styles.providerIcon}
			/>
			<Icon
				size={12}
				name={'google'}
				color={'black'}
				style={styles.providerIcon}
			/>
		</Layout>
	);
};

const SignInButton = props => {
	const { onPress, style, ...restProps } = props;
	return (
		<Button onPress={onPress} status={'basic'} style={style} {...restProps}>
			Sign in with <Icons />
		</Button>
	);
};
const styles = StyleSheet.create({
	providerIcon: {
		height: 40,
		tintColor: '#F7F9FC'
	},
	iconContainer: {
		display: 'flex',
		flexDirection: 'row'
	}
});
export default SignInButton;
