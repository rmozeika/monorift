import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Layout, Text, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';

function GroupActionBar({ name, close }) {
	return (
		<Layout style={styles.container}>
			<Text style={styles.groupname} category={'h2'}>
				{name}
			</Text>
			<Button style={styles.close} onPress={close} status={'danger'}>
				<Text>Close</Text>
			</Button>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 0,
		// flexBasis: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		opacity: 0.8
		// height: 40
	},
	groupname: {
		fontStyle: 'italic'
	},
	close: {
		// height: 40,
		// width: 40
	}
});

export default GroupActionBar;
