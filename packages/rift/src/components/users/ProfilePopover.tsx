import * as React from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	ImageProps,
	Linking
} from 'react-native';
import {
	Input,
	Layout,
	Button,
	Popover,
	Text,
	Icon,
	PopoverElement,
	PopoverProps
} from '@ui-kitten/components';
import {
	withStyles,
	ThemedComponentProps,
	ThemeType,
	StyledComponentProps
} from '@ui-kitten/components/theme';

import Gravatar from '@components/users/Gravatar';
import UpdateTempUsername from '@components/users/UpdateTempUsername';
import { originLink } from '../../core/utils';
interface User {
	// displayName?: string;
	gravatar?: string;
	username?: string;
	id?: number;
}

interface ProfileProps {
	loggedIn: boolean;
	user: User;
	alert?: string | null;
}

type ProfilePopoverProps = ProfileProps & ThemedComponentProps;
interface ProfileState {
	visible?: boolean;
}

const gravatarDimensions = '5vh';

class ProfilePopover extends React.Component<
	ProfilePopoverProps,
	ProfileState
> {
	public constructor(props: ProfilePopoverProps) {
		super(props);
		this.state = {
			visible: false
		};
	}
	private renderSigninIcon = ({ style }): React.ReactElement<ImageProps> => {
		// const { themedStyle } = this.props;
		return <Icon name="sign-in-alt" color={'#F7F9FC'} style={style} solid />;
	};
	private renderSignoutIcon = ({ style }): React.ReactElement<ImageProps> => {
		return (
			<Icon name="sign-out-alt" color={'#F7F9FC'} style={{ ...style }} solid />
		);
	};
	private renderAlertIcon = ({ style }): React.ReactElement<ImageProps> => {
		return <Icon name="alert" color={'#FF3D71'} style={style} solid />;
	};
	private renderProfileIcon = ({ style }): React.ReactElement<ImageProps> => {
		return <Icon name="caret-down" color={'#F7F9FC'} style={style} solid />;
	};
	private renderProfileCloseIcon = ({
		style
	}): React.ReactElement<ImageProps> => {
		// return <Icon name="x" color={'#F7F9FC'} style={{ ...style, backgroundColor: 'rgb(34, 43, 69)' }} solid />;
		return <Icon name="x" color={'#F7F9FC'} style={{ ...style }} solid />;
	};
	private renderMenuIcon = ({ style }): React.ReactElement<ImageProps> => {
		// const { themedStyle } = this.props;
		return <Icon name="bars" color={'#F7F9FC'} style={{ ...style }} solid />;
	};

	private toggleProfilePopover = (): void => {
		const { visible } = this.state;
		this.setState({ visible: !visible });
		return;
	};
	private onSignout(): void {
		Linking.openURL(originLink('logout')).catch(err => {
			console.error('An error occurred', err);
		});
	}
	private renderAnchor = (): React.ReactElement<ImageProps> => {
		return (
			<TouchableOpacity
				style={styles.openProfile}
				onPress={this.toggleProfilePopover}
			>
				<Gravatar
					style={styles.gravatarContainer}
					// heightVh={gravatarDimensions}
					// square={true}
					isScrolling={false}
					imageStyles={styles.gravatar}
					uri={this.props.user.gravatar}
					id={this.props.user.id}
				/>
				<Layout style={styles.userIconContainer}>
					{this.props.alert && this.renderAlertIcon({ style: styles.userIcons })}
					{this.renderProfileIcon({ style: styles.userIcons })}
				</Layout>

				<Text style={styles.myUsername}>{this.props.user.username}</Text>
			</TouchableOpacity>
		);
	};
	public render(): React.ReactNode {
		const { visible } = this.state;
		return (
			// @ts-ignore
			<Popover
				// @ts-ignore
				visible={visible}
				anchor={this.renderAnchor}
				onBackdropPress={this.toggleProfilePopover}
			>
				<Layout style={styles.popoverLayout}>
					<Layout style={styles.signoutPopoverItem}>
						<Button
							style={styles.signoutButton}
							size={'small'}
							status={'danger'}
							onPress={this.onSignout}
						>
							Sign out
						</Button>
						<Button
							size={'small'}
							appearance={'ghost'}
							style={styles.profileCloseButton}
							onPress={this.toggleProfilePopover}
							accessoryLeft={this.renderProfileCloseIcon}
						/>
					</Layout>
					<UpdateTempUsername />
				</Layout>
				{/* {this.renderContent} */}
			</Popover>
		);
	}
}

const styles = StyleSheet.create({
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
		// backgroundColor: 'inherit'
		// maxHeight: gravatarDimensions || '10vh',
		// maxWidth: gravatarDimensions || '10vh'
	},
	gravatar: {
		minWidth: 20,
		minHeight: 20,
		maxHeight: gravatarDimensions,
		maxWidth: gravatarDimensions,
		height: '100%',
		width: '100%',
		borderRadius: 100
		// backgroundColor: 'inherit'
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
		marginVertical: 15
		// backgroundColor: 'inherit'
	},
	signoutButton: {
		flexGrow: 1
	},
	myUsername: {
		fontWeight: '600',
		padding: 5,
		fontSize: 12,
		color: '#F7F9FC'
	},
	userIconContainer: {
		flexDirection: 'column'
		// backgroundColor: 'inherit'
	},
	userIcons: {
		alignItems: 'center',
		textAlign: 'center'
	},
	profileCloseButton: {
		//backgroundColor: 'rgb(34, 43, 69)'
		backgroundColor: 'rgb(26, 34, 55)'
	}
});

export default ProfilePopover;
