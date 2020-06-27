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
		const { name, gid, gravatar, memberOf } = this.props.group;
		// this.props.addTab({ name, gid, listType: gid, group: true });
		this.props.goToMembers({ name, gid, gravatar });
		// this.props.navigation.navigate(name);
	};
	render() {
		const { name, gid, active = true, gravatar } = this.props.group;
		return (
			<ListItem style={styles.listItem}>
				<Layout style={styles.listItemMain}>
					<TouchableOpacity style={styles.listItemTouchable} onPress={this.onClick}>
						<Gravatar
							style={styles.gravatarContainer}
							uri={gravatar}
							// id={id}
							imageStyles={styles.gravatar}
							isScrolling={false}
						/>
						<Layout style={styles.titleContainer}>
							<Text style={styles.listItemTitle}>{name}</Text>
							{active && <Text style={styles.listItemDetails}>active</Text>}
						</Layout>
					</TouchableOpacity>
				</Layout>
			</ListItem>
		);
	}
}
const styles = StyleSheet.create({
	listItem: {
		...listItemStyleBase
	},
	listItemMain: {
		// backgroundColor: 'inherit',
		flexBasis: '25%',
		zIndex: 10,
		justifyContent: 'center',
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		flexGrow: 1,
		flexShrink: 1
	},
	listItemTouchable: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row'
	},
	titleContainer: {
		flexBasis: '50%',
		flexGrow: 1,
		// backgroundColor: 'inherit',
		alignContent: 'center',
		justifyContent: 'center'
	},
	listItemTitle: {
		fontSize: 13,
		fontWeight: '600',
		textAlign: 'left',
		paddingLeft: 10,
		color: '#EDF1F7'
	},
	listItemDetails: {
		fontSize: 10,
		fontWeight: '400',
		textAlign: 'left',
		alignContent: 'center',
		paddingRight: 20,
		paddingLeft: 10,
		color: '#00E096'
	},
	gravatar: {
		minWidth: 20,
		minHeight: 20,
		maxHeight: 40,
		maxWidth: 40,
		height: '100%',
		width: '100%',
		borderRadius: 100
		// backgroundColor: 'inherit'
	},
	gravatarContainer: {
		flexBasis: 50,
		flex: 0,
		marginLeft: 10,
		// backgroundColor: 'inherit',
		justifyContent: 'center',
		alignItems: 'flex-end'
	}
});
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
