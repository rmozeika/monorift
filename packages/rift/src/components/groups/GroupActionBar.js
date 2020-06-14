import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Layout, Text, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';

function GroupActionBar({ close }) {
	return (
		<Layout style={styles.container}>
			<Button onPress={close} status={'danger'}>
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
		height: 60
	}
});

export default GroupActionBar;
