import * as React from 'react';
import {
	Layout,
	Text,
	List,
	Button,
	styled,
	withStyles
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, FlatList } from 'react-native';
import * as Actions from '@actions';
import * as GroupSelectors from '@selectors/groups';
import SearchBar from '@components/users/SearchBar';
import GroupItem from './GroupItem';
import { fetchGroupMembers } from '@actions';

const ITEM_HEIGHT = 120;
class GroupsTab extends React.PureComponent {
	constructor(props) {
		super(props);
		this.props.fetchGroups();
	}
	_keyExtractor = item => {
		return item.toString(16);
	};
	getItemLayout(data, index) {
		return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
	}
	goToMembers = ({ name, gid }) => {
		this.props.addTab({ name, gid, listType: gid, group: true });
	};
	renderItem = ({ item: group, index, ...restProps }) => {
		// IF REACTIVATE PROFILE
		// if (group == 'self') {
		// 	return (<YourProfile themedStyle={this.props.themedStyle.groupItem} />);
		// }
		return (
			<GroupItem
				goToMembers={this.goToMembers}
				addTab={this.props.addTab}
				gid={group}
				key={group}
			/>
		);
		// return (
		// 	<GroupItem key={group} id={group} />
		// );
	};
	render() {
		const { groups } = this.props;
		return (
			<List
				data={groups}
				renderItem={this.renderItem}
				style={styles.list}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.listContentContainer}
				// numColumns={2}
				// columnWrapperStyle={styles.columnWrapper}
				initialNumToRender={8}
				keyExtractor={this._keyExtractor}
				getItemLayout={this.getItemLayout}
			/>
		);
	}
}
const styles = StyleSheet.create({
	list: {
		width: '100%',
		backgroundColor: '#101426'
	},
	listContentContainer: {
		// flexShrink: 1,
		// flexDirection: 'row',
		// flexWrap: 'wrap',
		justifyContent: 'space-between',
		backgroundColor: '#101426'
	},

	// unused (unless multi column enabled)
	column: {
		padding: 15,
		height: 'auto',
		width: 'auto',
		flexBasis: 'auto',
		flexShrink: 0,
		flexGrow: 1
	},
	columnWrapper: {
		flexBasis: 150,
		flexGrow: 1,
		flexShrink: 1,
		marginVertical: 4
	}
});

const mapStateToProps = (state, ownProps) => {
	const { listType } = ownProps.route.params;
	return {
		listType,
		groups: GroupSelectors.filteredGroups(state, ownProps)
	};
};
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchGroups: () => dispatch({ type: Actions.FETCH_GROUPS }),
		fetchGroupMembers: gid => dispatch(Actions.fetchGroupMembers(gid))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupsTab);
