import React from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	ImageProps,
	Linking
} from 'react-native';
import { connect } from 'react-redux';

import { Input, Layout, Button, Popover, Text } from '@ui-kitten/components';
import { authSelectors } from '@selectors';
import Gravatar from '@components/users/Gravatar';
import UpdateTempUsername from '@components/users/UpdateTempUsername';

import { originLink } from '../../core/utils';
import {
	withStyles,
	ThemedComponentProps,
	ThemeType,
	StyledComponentProps
} from '@ui-kitten/components/theme';
import {
	Icon,
	TopNavigationAction,
	TopNavigationActionProps
} from '@ui-kitten/components';
import 'react-native-gesture-handler';
const gravatarDimensions = '5vh';

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
	alert?: string | null;
	id?: string;
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
	private renderAlertIcon = (style): React.ReactElement<ImageProps> => {
		return <Icon name="alert" color={'#FF3D71'} style={style} solid />;
	};
	private renderProfileIcon = (style): React.ReactElement<ImageProps> => {
		return <Icon name="caret-down" color={'#fff'} style={style} solid />;
	};
	private renderProfileCloseIcon = (style): React.ReactElement<ImageProps> => {
		return <Icon name="x" color={'#fff'} style={{ ...style }} solid />;
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
			<Layout style={styles.popoverLayout}>
				<Layout style={styles.signoutPopoverItem}>
					<Button
						style={{ flexGrow: 1 }}
						size={'small'}
						status={'danger'}
						onPress={this.onSignout}
					>
						Sign out
					</Button>
					<Button
						size={'small'}
						appearance={'ghost'}
						onPress={this.toggleProfilePopover}
						icon={this.renderProfileCloseIcon}
					/>
				</Layout>
				<UpdateTempUsername />
			</Layout>
		);
	};
	private renderLeftControls(): React.ReactElement<TopNavigationActionProps> {
		const { themedStyle, loggedIn, username = '', alert, id } = this.props;
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
							id={id}
						/>
						<Layout style={styles.userIconContainer}>
							{alert && this.renderAlertIcon(styles.userIcons)}
							{this.renderProfileIcon(styles.userIcons)}
						</Layout>

						<Text style={styles.myUsername}>{username}</Text>
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
	},
	popoverLayout: {
		flexDirection: 'column',
		backgroundColor: 'rgb(26, 34, 55)',
		// padding: 10,
		minWidth: 300,
		padding: 10
	},
	signoutPopoverItem: {
		flexDirection: 'row',
		marginVertical: 15,
		backgroundColor: 'inherit'
	},
	myUsername: {
		fontWeight: '600',
		padding: 5,
		fontSize: 12
	},
	userIconContainer: {
		flexDirection: 'column',
		backgroundColor: 'inherit'
	},
	userIcons: {
		alignItems: 'center',
		textAlign: 'center'
	}
});

const mapStateToProps = state => {
	const { auth } = state;
	return {
		loggedIn: authSelectors.loggedIn(state),
		username: authSelectors.getSelfUsername(state),
		id: authSelectors.getSelfId(state),
		alert: authSelectors.getAlert(state)
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
