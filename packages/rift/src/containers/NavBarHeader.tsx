import React from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	ImageProps,
	Linking
} from 'react-native';
import { connect } from 'react-redux';

import { Input, Layout, Button, Popover } from '@ui-kitten/components';
import { authSelectors } from '@selectors';
import Gravatar from '@components/users/Gravatar';
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
import 'react-native-gesture-handler';
const gravatarDimensions = '5vh';
const styles = StyleSheet.create({
	container: {
		flexDirection: 'row'
		// height: '90%'
	},
	topNavigation: { backgroundColor: 'rgb(26, 34, 55)' },
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
		padding: 0,
		paddingHorizontal: 0
	},
	openProfile: {
		flexDirection: 'row',
		alignItems: 'center'
		// height: '90%'
	},
	gravatarContainer: {
		marginHorizontal: 8,
		marginRight: 4,
		height: gravatarDimensions,
		width: gravatarDimensions
		// maxHeight: gravatarDimensions || '10vh',
		// maxWidth: gravatarDimensions || '10vh'
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
interface NavBarState {
	profilePopoverActive: boolean;
}
class NavBar extends React.Component<NavProps, NavBarState> {
	public constructor(props: NavProps) {
		super(props);
		this.state = {
			profilePopoverActive: false
		};
	}
	private renderSigninIcon = (style): React.ReactElement<ImageProps> => {
		const { themedStyle } = this.props;
		return <Icon name="sign-in-alt" color={'#fff'} style={{ ...style }} solid />;
	};
	private renderSignoutIcon = (style): React.ReactElement<ImageProps> => {
		return <Icon name="sign-out-alt" color={'#fff'} style={{ ...style }} solid />;
	};
	private renderProfileIcon = (style): React.ReactElement<ImageProps> => {
		return <Icon name="caret-down" color={'#fff'} style={{ ...style }} solid />;
	};
	private renderMenuIcon = (style): React.ReactElement<ImageProps> => {
		const { themedStyle } = this.props;
		return <Icon name="bars" color={'#fff'} style={{ ...style }} solid />;
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
	private toggleProfilePopover = (): void => {
		const { profilePopoverActive } = this.state;
		this.setState({ profilePopoverActive: !profilePopoverActive });
	};
	private openMenu(): void {}

	private renderProfilePopover = (): React.ReactElement<ImageProps> => {
		return (
			<Layout>
				<Button></Button>
			</Layout>
		);
	};
	private renderLeftControls(): React.ReactElement<TopNavigationActionProps> {
		const { themedStyle, loggedIn, username = '' } = this.props;
		// let icon = this.renderMenuIcon;
		// let onPress = this.openMenu;
		const configs = {
			loggedIn: {
				title: `Welcome ${username}`,
				icon: this.renderMenuIcon,
				onPress: this.openMenu
			},
			guest: {
				title: 'Sign In',
				icon: this.renderSigninIcon,
				onPress: this.onSignin
			}
		};
		// if (!loggedIn) {
		// 	const title = loggedIn ? `Welcome ${username}` : 'Sign in';

		// 	icon = this.renderSigninIcon;
		// 	onPress = this.onSignin;
		// }
		const { onPress, title, icon } = configs[loggedIn ? 'loggedIn' : 'guest'];
		if (loggedIn) {
			// const togglePopover = () => {

			// }
			return (
				<Popover
					visible={this.state.profilePopoverActive}
					content={this.renderProfilePopover()}
					onBackdropPress={this.toggleProfilePopover}
				>
					<TouchableOpacity
						style={styles.openProfile}
						onPress={this.toggleProfilePopover}
					>
						<Gravatar
							style={styles.gravatarContainer}
							heightVh={gravatarDimensions}
							square={true}
							username={username}
						/>
						{this.renderProfileIcon({})}
					</TouchableOpacity>
				</Popover>
			);
		}
		return (
			<Button
				onPress={onPress}
				appearance={'ghost'}
				status={'basic'}
				icon={icon}
				style={styles.button}
				textStyle={styles.buttonText}
			>
				{title}
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
		const tabColor = 'rgb(26, 34, 55)';

		const { loggedIn, username } = this.props;
		const title = loggedIn ? `Welcome ${username}` : 'Sign in';
		return (
			<Layout style={[styles.container, { backgroundColor: tabColor }]}>
				{this.renderLeftControls()}
			</Layout>
		);
	}
}

const mapStateToProps = state => {
	const { auth } = state;
	return {
		loggedIn: authSelectors.loggedIn(state),
		username: authSelectors.getSelfUsername(state)
	};
};

// remove
export const NavBarWithStyles = withStyles(NavBar, (theme: ThemeType) => ({
	signinButton: { backgroundColor: theme['color-primary-100'] },
	icons: { backgroundColor: theme['color-primary-100'] },
	container: { backgroundColor: '#1A2138' },
	action: { marginHorizontal: 4 }
}));

export default connect(mapStateToProps, {})(NavBarWithStyles);
