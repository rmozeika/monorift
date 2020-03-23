import React from 'react';
import { Input, Layout, Button } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { StyleSheet, Text, ImageProps, Linking } from 'react-native';
import { authSelectors } from '@selectors';
import {
	ThemeContext,
	ThemeContextType,
	ThemeKey,
	themes,
	ThemeStore,
	ThemeService
} from '../core/themes';
import { originLink } from '../core/utils';
import {
	withStyles,
	ThemedComponentProps,
	ThemeType,
	StyledComponentProps
} from '@ui-kitten/components/theme';
import {
	Icon,
	TopNavigation,
	TopNavigationAction,
	TopNavigationActionProps,
	TopNavigationProps,
	IconProps
} from '@ui-kitten/components';
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
	},
	topNavigation: { backgroundColor: '#1A2138' },
	title: { color: '#EDF1F7' },
	subtitle: { color: '#C5CEE0' },
	buttonText: {
		// color: '#EDF1F7',
		color: '#fff',
		fontSize: 15,
		fontWeight: '600',
		marginLeft: 0,
		marginHorizontal: 0
	},
	button: {
		backgroundColor: '#1A2138',
		padding: 0
	}
});

interface Auth {
	loggedIn: boolean;
	// user: User;
	username: string;
}
interface User {
	displayName?: string;
	picture?: string;
	username?: boolean;
}

interface NavBarProps {
	loggedIn: boolean;
	// user: User;
	username: string;
}

type NavProps = NavBarProps & ThemedComponentProps;

class NavBar extends React.Component<NavProps, {}> {
	private renderSigninIcon = (style): React.ReactElement<ImageProps> => {
		const { themedStyle } = this.props;
		return <Icon name="sign-in-alt" color={'#fff'} style={{ ...style }} solid />;
	};
	private renderSignoutIcon = (style): React.ReactElement<ImageProps> => {
		return <Icon name="sign-out-alt" style={{ ...style }} solid />;
	};
	private renderMenuIcon = (style): React.ReactElement<ImageProps> => {
		const { themedStyle } = this.props;
		return <Icon name="bars" style={{ ...style }} solid />;
	};

	private onSignin(): void {
		Linking.openURL(originLink('login')).catch(err => {
			console.error('An error occurred', err);
		});
	}

	private onSignout(): void {
		Linking.openURL(originLink('logout')).catch(err => {
			console.error('An error occurred', err);
		});
	}
	private openMenu(): void {}
	private renderLeftControls(): React.ReactElement<TopNavigationActionProps> {
		const { themedStyle, loggedIn, username } = this.props;
		let icon = this.renderMenuIcon;
		let onPress = this.openMenu;
		const config = {
			loggedIn: {
				title: `Welcome ${username}`
			}
		};
		if (!loggedIn) {
			const title = loggedIn ? `Welcome ${username}` : 'Sign in';

			icon = this.renderSigninIcon;
			onPress = this.onSignin;
		}
		return (
			<Button
				onPress={this.onSignin}
				appearance={'ghost'}
				status={'basic'}
				icon={icon}
				style={styles.button}
				textStyle={styles.buttonText}
			>
				Sign In
			</Button>
		);
	}
	private renderRightControls(): React.ReactElement<TopNavigationActionProps> {
		const { themedStyle } = this.props;
		const icon = this.renderSignoutIcon;
		const onPress = this.onSignout;
		return (
			<TopNavigationAction
				icon={icon}
				onPress={onPress}
				style={themedStyle.action}
			/>
		);
	}

	public render(): React.ReactNode {
		const { loggedIn, username } = this.props;
		const title = loggedIn ? `Welcome ${username}` : 'Sign in';
		return <Layout style={styles.container}>{this.renderLeftControls()}</Layout>;
	}
}

const mapStateToProps = state => {
	const { auth } = state;
	return {
		loggedIn: authSelectors.loggedIn(state),
		username: authSelectors.getSelfUsername(state)
	};
};

export const NavBarWithStyles = withStyles(NavBar, (theme: ThemeType) => ({
	signinButton: { backgroundColor: theme['color-primary-100'] },
	icons: { backgroundColor: theme['color-primary-100'] },
	container: { backgroundColor: '#1A2138' },
	action: { marginHorizontal: 4 }
}));

export default connect(mapStateToProps, {})(NavBarWithStyles);
