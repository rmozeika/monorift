import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '@actions';
import { getAlert } from '@selectors/auth';
import { Layout, Input, Text, Button } from '@ui-kitten/components';

import Alert from './Alert';

function CreateGuest(props) {
	const [username, onChangeUsernameText] = React.useState('');
	const [password, onChangePasswordText] = React.useState('');
	const dispatch = useDispatch();
	const alert = useSelector(getAlert);
	return (
		<Layout style={styles.container}>
			<Alert message={alert} />
			<Input
				placeholder="Name"
				value={username}
				onChangeText={text => onChangeUsernameText(text)}
				// value={this.state.filterText}
				// onChangeText={this.setFilterText}
				// style={styles.searchInput}
			/>
			<Input
				placeholder="Password (optional)"
				value={password}
				onChangeText={text => onChangePasswordText(text)}
				secureTextEntry={true}
				inportantForAutofill={true}
				// value={this.state.filterText}
				// onChangeText={this.setFilterText}
				// style={styles.searchInput}
			/>
			<Layout style={styles.buttonRow}>
				<Button
					status={'basic'}
					style={styles.button}
					onPress={() => dispatch(Actions.simpleLogin(username, password))}
				>
					Sign In
				</Button>
				<Button
					style={styles.button}
					onPress={() => dispatch(Actions.createGuest(username, password))}
				>
					Sign Up
				</Button>
			</Layout>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		display: 'flex'
	},
	buttonRow: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'stretch'
	},
	button: {
		flex: 1,
		margin: 8
	}
});

export default CreateGuest;
