import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import { getUser } from '@selectors/users';
import AddToCallButton from '@components/buttons/AddToCall';
import AddRemoveFriendButton from '@components/buttons/AddRemoveFriend';
import Gravatar from '@components/users/Gravatar';
import QuickCall from '@components/buttons/QuickCall';
import { listItemStyleBase } from '@core/themes/styles/listItem';
import { getGroup } from '@selectors/groups';
class GroupItem extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	fetchGroupMembers = () => {
		const { gid, fetchGroupMembers } = this.props;
		fetchGroupMembers(gid);
	};
	onClick = () => {
		this.fetchGroupMembers();
		const { name, gid } = this.props.group;
		// this.props.addTab({ name, gid, listType: gid, group: true });
		this.props.goToMembers({ name, gid });
		// this.props.navigation.navigate(name);
	};
	render() {
		const { name, gid } = this.props.group;
		return (
			<ListItem>
				<TouchableOpacity onPress={this.onClick}>
					<Layout>
						<Text>{name}</Text>
						<Text>{gid}</Text>
					</Layout>
				</TouchableOpacity>
			</ListItem>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		group: getGroup(state, props)
	};
};
const mapDispatchToProps = (dispatch, props) => {
	return {
		fetchGroupMembers: gid => dispatch(Actions.fetchGroupMembers(gid))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupItem);
