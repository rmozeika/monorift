import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';

const Alert = ({ message }) => {
	if (!message) return null;
	return (
		<Layout style={styles.alternativeContainer}>
			<Text style={{ fontWeight: '500' }}>{message}</Text>
		</Layout>
	);
};

const styles = StyleSheet.create({
	alternativeContainer: {
		borderRadius: 4,
		margin: 8,
		backgroundColor: '#FF3D71',
		height: 'auto',
		padding: 5,
		textAlign: 'center',
		justifyContent: 'center'
	}
});

export default Alert;
