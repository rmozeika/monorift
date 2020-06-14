import * as React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import UsersList from '../users/UsersList.native';
import SearchBar from '@components/users/SearchBar';

import CallActions from '@components/buttons/CallActions';
import GroupActionBar from '@components/groups/GroupActionBar';
class GroupView extends React.Component {
	constructor(props) {
		super(props);
	}
	close = () => {
		const { key } = this.props.route.params;
		this.props.removeTab({ key });
	};
	render() {
		return (
			<Layout style={styles.container}>
				<GroupActionBar close={this.close} />
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

export default GroupView;
