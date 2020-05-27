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
// import Gravatar from '@components/users/Gravatar';
// import UpdateTempUsername from '@components/users/UpdateTempUsername';
import ProfilePopover from '@components/users/ProfilePopover';
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
	// profilePopoverActive: boolean;
}
class NavBar extends React.Component<NavProps, NavBarState> {
	public constructor(props: NavProps) {
		super(props);
	}
	private renderSigninIcon = ({
		style,
		...restProps
	}): React.ReactElement<ImageProps> => {
		return (
			<Icon
				size={style.height}
				name="sign-in-alt"
				color={'#F7F9FC'}
				style={style}
				solid
			/>
		);
	};

	private renderMenuIcon = ({ style }): React.ReactElement<ImageProps> => {
		return <Icon name="bars" color={'#F7F9FC'} style={{ ...style }} solid />;
	};

	private onSignin(): void {
		Linking.openURL(originLink('login')).catch(err => {
			console.error('An error occurred', err);
		});
	}

	private openMenu(): void {}

	private renderLeftControls(): React.ReactElement<TopNavigationActionProps> {
		const { loggedIn, username = '', alert, id } = this.props;
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
			return (
				<ProfilePopover
					username={username}
					loggedIn={loggedIn}
					id={id}
					alert={alert}
				/>
			);
			// }
		}
		return (
			<Button
				onPress={onPress}
				appearance={'ghost'}
				status={'basic'}
				accessoryLeft={icon}
				style={styles.button}
				// textStyle={styles.buttonText}
			>
				{evaProps => (
					<Text {...evaProps} style={styles.buttonText}>
						{title}
					</Text>
				)}
			</Button>
		);
	}

	public render(): React.ReactNode {
		const tabColor = 'inherhit'; //'rgb(21, 26, 48);'; //'rgb(21, 26, 48);';

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
	topNavigation: {
		// backgroundColor: 'inherhit' //'rgb(21, 26, 48);'
	},
	title: { color: '#EDF1F7' },
	subtitle: { color: '#C5CEE0' },
	buttonText: {
		// color: '#EDF1F7',
		color: '#F7F9FC',
		fontSize: 15,
		fontWeight: '600',
		marginLeft: 0,
		marginHorizontal: 0
	},
	button: {
		// backgroundColor: 'inherhit', //'#1A2138',
		padding: 0,
		paddingHorizontal: 0
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
