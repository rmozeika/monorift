import React, { Component } from 'react';
import {
	Layout,
	Text,
	Button,
	styled,
	withStyles,
	Input,
	Card,
	CardHeader
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';

// const aboutText = `Monorift is a peer-to-peer voice and video communication  application, which represents my minimalistic, scalable, and beautiful development methodology.
// Built on a customized foundation of react-native-web; the app is designed to run on any device or browser, where users can seamlessly drop in. Auth0 (oauth2) allows quick account creation. Runs on both kubernetes and docker.`;
class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			update: {
				status: null,
				output: null
			}
		};
	}
	updateDeploy = () => {
		fetch('https://monorift.com/deploy/update')
			.then(res => res.json())
			.then(res => {
				console.log(res);
				this.setState({ update: res });
			})
			.catch(e => {
				this.setState({ update: { status: 'error', output: e } });
			});
	};
	renderUpdateView = () => {
		const { status, output } = this.state.update;
		if (status == null) return null;
		return (
			<Layout>
				<Text status={status == 'success' ? 'success' : 'danger'} category="h6">
					{status}
				</Text>
				<Text category="p1">{output}</Text>
			</Layout>
		);
	};
	render() {
		return (
			<Layout style={styles.container}>
				<Button onPress={this.updateDeploy}>Update Deploy</Button>
				{this.renderUpdateView()}
			</Layout>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		overflow: 'scroll',
		padding: 20
	},
	row: {
		padding: 15,
		width: '100%'
	},
	card: {
		margin: '25px'
	}
});

export default Admin;
