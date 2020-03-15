import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import * as CallSelectors from '../selectors/call';
import { useSelector } from 'react-redux';

import {
	Layout,
	Text,
	Button,
	ButtonGroup,
	styled,
	Icon,
	List,
	ListItem,
	withStyles,
	Toggle
} from '@ui-kitten/components';
import { loadData } from '@src/actions';
const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

const YourProfile = ({}) => {
	const { loggedIn, user } = useSelector(state => state.auth);
	if (!loggedIn) {
		return (
			<Layout>
				<Text>Sign in to see profile</Text>
			</Layout>
		);
	}
	return <Layout></Layout>;
};

export default YourProfile;
