import * as React from 'react';
import { StyleSheet, Linking } from 'react-native';
import {
	Layout,
	List,
	withStyles,
	Text,
	Button,
	Icon
} from '@ui-kitten/components';
import { originLink } from '../../core/utils';
import CreateGuest from './CreateGuest';
import AuthIcons from '@components/buttons/AuthIcons';

const signIn = () => {
	Linking.openURL(originLink('login')).catch(err => {
		console.error('An error occurred', err);
	});
};

const GoToUsersIcon = () => (
	<Icon name={'pointed-right'} size={16} color={'#F7F9FC'}></Icon>
);
export default EmptyFriendsPrompt = ({ goToUsers, loggedIn, checked }) => {
	if (!checked) {
		return (
			<Layout style={styles.container}>
				<Text category={'h4'}>Loading...</Text>
			</Layout>
		);
	}
	if (loggedIn) {
		return (
			<Layout style={styles.container}>
				<Text style={styles.message} category={'h4'}>
					Add some friends
				</Text>
				{/* <Button onPress={goToUsers} icon={GoToUsersIcon} style={[styles.button, { flexDirection: 'row-reverse', flexBasis: 'auto' }]}>Go To Users</Button> */}
				<Layout style={styles.buttonRow}>
					<Button
						onPress={goToUsers}
						accessoryRight={GoToUsersIcon}
						style={styles.button}
						// style={[
						// 	styles.button,
						// 	{ flexDirection: 'row-reverse', flexBasis: 'auto' }
						// ]}
					>
						Go To Users
					</Button>
				</Layout>
			</Layout>
		);
	}
	return (
		<Layout style={styles.container}>
			<Text style={styles.message} category={'h4'}>
				Sign in for friends
			</Text>
			<Layout style={styles.buttonRow}>
				<CreateGuest />
			</Layout>
			<Layout style={styles.buttonRow}>
				{/* <AuthIcons onPress={signIn} style={styles.button} /> */}
				<Button onPress={signIn} status={'basic'} style={styles.button}>
					Sign in with facebook, google, github
				</Button>
				<Button
					onPress={goToUsers}
					accessoryRight={GoToUsersIcon}
					style={styles.button}
				>
					Continue as Guest
				</Button>
			</Layout>
		</Layout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	buttonRow: {
		display: 'flex',
		flexDirection: 'column',
		// justifyContent: 'space-evenly',
		// alignContent: 'space-evenly',
		width: '85%',
		margin: 15
	},
	button: {
		margin: 5,
		// flexBasis: '45%',
		textAlign: 'center'
	},
	message: {
		marginTop: '20%'
	},
	providerIcon: {
		height: 40,
		tintColor: '#F7F9FC'
	}
});
