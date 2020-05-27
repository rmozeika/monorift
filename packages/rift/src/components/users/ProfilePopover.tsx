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

interface ProfileProps {
	loggedIn: boolean;
	// user: User;
	username: string;
	alert?: string | null;
	id?: string;
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
	private renderAnchor2 = (): React.ReactElement<ImageProps> => {
		return (
			<Layout>
				<Text>Anchor</Text>
			</Layout>
		);
	};
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
					id={this.props.id}
				/>
				<Layout style={styles.userIconContainer}>
					{this.props.alert && this.renderAlertIcon({ style: styles.userIcons })}
					{this.renderProfileIcon({ style: styles.userIcons })}
				</Layout>

				<Text style={styles.myUsername}>{this.props.username}</Text>
			</TouchableOpacity>
		);
	};
	private renderContent = (): React.ReactElement<ImageProps> => {
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
						accessoryLeft={this.renderProfileCloseIcon}
					/>
				</Layout>
				<UpdateTempUsername />
			</Layout>
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
	}
});

export default ProfilePopover;
