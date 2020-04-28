import * as React from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	ImageProps,
	Linking
} from 'react-native';

const ProfilePopover = () => {
	return (
		<Popover
			visible={this.state.profilePopoverActive}
			content={this.renderProfilePopover()}
			onBackdropPress={this.toggleProfilePopover}
			anchor={ProfileAnchor}
		>
			<ProfileContent />
		</Popover>
	);
};
const ProfileContent = ({ onSignout, toggleProfilePopover }) => {
	return (
		<Layout style={styles.popoverLayout}>
			<Layout style={styles.signoutPopoverItem}>
				<Button
					style={{ flexGrow: 1 }}
					size={'small'}
					status={'danger'}
					onPress={onSignout}
				>
					Sign out
				</Button>
				<Button
					size={'small'}
					appearance={'ghost'}
					onPress={toggleProfilePopover}
					icon={this.renderProfileCloseIcon}
				/>
			</Layout>
			<UpdateTempUsername />
		</Layout>
	);
};
const ProfileAnchor = () => {
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
				id={id}
			/>
			<Layout style={styles.userIconContainer}>
				{alert && this.renderAlertIcon(styles.userIcons)}
				{this.renderProfileIcon(styles.userIcons)}
			</Layout>

			<Text style={styles.myUsername}>{username}</Text>
		</TouchableOpacity>
	);
};

export default ProfilePopover;
