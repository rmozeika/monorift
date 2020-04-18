import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as Actions from '@actions';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { getAlert } from '@selectors/auth';
import Alert from './Alert';

const UpdateTempUsername = props => {
	const [value, onChangeText] = React.useState('');
	const dispatch = useDispatch();
	const alert = useSelector(getAlert);
	return (
		<Layout style={{ backgroundColor: 'inherit' }}>
			<Alert message={alert} />
			<Input
				placeholder="Desired Username"
				value={value}
				onChangeText={text => onChangeText(text)}
				// value={this.state.filterText}
				// onChangeText={this.setFilterText}
				// style={styles.searchInput}
			/>
			<Button onPress={() => dispatch(Actions.updateUsername(value))}>
				Change Username
			</Button>
		</Layout>
	);
};

const styles = StyleSheet.create({
	text: {
		margin: 8
	}
});

export default UpdateTempUsername;
