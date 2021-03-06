import * as React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import UsersList from '../users/UsersList.native';
import SearchBar from '@components/users/SearchBar';

import CallActions from '@components/talk/buttons/CallActions';

class UsersView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Layout style={styles.container}>
				<SearchBar />
				<UsersList {...this.props} />
				<CallActions />
			</Layout>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: '#101426'
	}
});

export default UsersView;
