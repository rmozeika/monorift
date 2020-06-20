import * as React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import UsersList from '../users/UsersList.native';
import SearchBar from '@components/users/SearchBar';
import * as Actions from '@actions';
import CallActions from '@components/buttons/CallActions';
import GroupActionBar from '@components/groups/GroupActionBar';
class GroupView extends React.Component {
	constructor(props) {
		super(props);
		// const { listType, group } = props.route.params;
		this.watchGroup();
	}
	watchGroup() {
		const { gid = 6 } = this.props.route.params;
		this.props.watchGroup(gid);
	}
	close = () => {
		const { key } = this.props.route.params;
		this.props.removeTab({ key });
	};
	render() {
		return (
			<Layout style={styles.container}>
				<SearchBar />
				<GroupActionBar name={this.props.route.name} close={this.close} />
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
const mapStateToProps = (state, ownProps) => {
	return {};
};
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		watchGroup: gid => dispatch(Actions.watchGroup(gid))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupView);
