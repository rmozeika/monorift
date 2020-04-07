import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as Actions from '@actions';
import { Layout, Input, Button, Text } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { getAlert } from '@selectors/auth';
const styles = StyleSheet.create({
	text: {
		margin: 8
	},
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

export default props => {
	const [value, onChangeText] = React.useState('');
	const dispatch = useDispatch();
	const alert = useSelector(getAlert);
	return (
		<Layout style={{ backgroundColor: 'inherit' }}>
			{alert && (
				<Layout style={styles.alternativeContainer}>
					<Text style={{ fontWeight: '500' }}>{alert}</Text>
				</Layout>
			)}
			<Input
				placeholder="Change Username"
				value={value}
				onChangeText={text => onChangeText(text)}
				// value={this.state.filterText}
				// onChangeText={this.setFilterText}
				// style={styles.searchInput}
			/>
			<Button onPress={() => dispatch(Actions.updateUsername(value))}>
				Submit
			</Button>
		</Layout>
	);
};
