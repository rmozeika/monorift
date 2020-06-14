import * as React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import GroupList from '../groups/GroupsList';
import SearchBar from '@components/users/SearchBar';

import CallActions from '@components/buttons/CallActions';

class GroupsView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Layout style={styles.container}>
				<SearchBar />
				<GroupList {...this.props} />
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

export default GroupsView;
