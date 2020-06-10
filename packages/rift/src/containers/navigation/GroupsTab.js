import * as React from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
import * as Actions from '@actions';

class GroupsTab extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Layout>
				<Text>Groups Tab</Text>
			</Layout>
		);
	}
}
const mapStateToProps = (state, ownProps) => {
	return {
		groups: state.groups
	};
};
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		// dispatch1: () => {
		//     dispatch(actionCreator)
		// }
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(GroupsTab);
