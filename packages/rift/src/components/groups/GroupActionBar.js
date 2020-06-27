import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Layout, Text, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import JoinButton from './Join';
import LeaveButton from './Leave';
import { wrap } from 'lodash';

function GroupActionBar({ name, close, gid, memberOf }) {
	return (
		<Layout style={styles.container}>
			<Text style={styles.groupname} category={'h2'}>
				{name}
			</Text>
			<Layout style={styles.buttons}>
				{memberOf ? <LeaveButton gid={gid} /> : <JoinButton gid={gid} />}
				<Button style={styles.close} onPress={close} status={'danger'}>
					<Text>Close</Text>
				</Button>
			</Layout>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		// flexGrow: 1,
		// flexBasis: '100%',
		flexDirection: 'row',
		// flexBasis:
		justifyContent: 'space-between',
		opacity: 0.8,
		flexWrap: 'wrap'
		// height: 40
	},
	groupname: {
		fontStyle: 'italic'
	},
	buttons: {
		flexBasis: 165,
		flexShrink: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		justifySelf: 'flex-end',
		marginLeft: 'auto'
	},
	close: {
		marginLeft: 5
		// height: 40,
		// width: 40
	}
});

export default GroupActionBar;
