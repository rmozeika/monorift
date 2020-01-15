import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';

import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center'
	},
	row: {
		padding: 15,
		width: '100%'
	}
});
class UsersList extends React.Component {
	constructor(props) {
		super();
	}
	render() {
		const { online } = this.props;
		const onlineUserList = online.map(user => {
			return <Text>{user}</Text>;
		});
		return <Layout style={styles.row}>{onlineUserList}</Layout>;
	}
}
export default UsersList;
