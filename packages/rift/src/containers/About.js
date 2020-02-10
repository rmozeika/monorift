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
} from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform, ScrollView } from 'react-native';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center',
		overflow: 'scroll',
		padding: 20
	},
	row: {
		padding: 15,
		width: '100%'
	},
	card: {
		// marginVertical: 8,
		// marginHorizontal: 16
		margin: '25px'
	}
});
// const Header = () => (<CardHeader title='About'/>);
const aboutText = `Monorift is a peer-to-peer voice and video communication  application, which represents my minimalistic, scalable, and beautiful development methodology. 
Built on a customized foundation of react-native-web; the app is designed to run on any device or browser, where users can seamlessly drop in. Auth0 (oauth2) allows quick account creation. Runs on both kubernetes and docker.`;
class AboutContainer extends React.Component {
	constructor(props) {
		super(props);
	}
	renderHeader() {
		return <CardHeader title="About" />;
	}
	render() {
		return (
			<Layout style={[styles.container, this.props.themedStyle.container]}>
				<Card styles={styles.card} header={this.renderHeader} status="success">
					<Text>{aboutText}</Text>
				</Card>
			</Layout>
		);
	}
}

export default withStyles(AboutContainer, theme => ({
	container: {
		backgroundColor: theme['color-primary-100']
	}
}));
