import * as React from 'react';
import { Button, Icon, Layout } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	button: {
		flex: 1,
		margin: 0,
		marginRight: 0,
		minWidth: 10,
		height: '100%',
		boxShadow: `inset 6px 6px 12px #1cac75, inset -6px -6px 12px #2cffbb`,
		borderRadius: 0,
		color: '#EDF1F7'
	},
	buttonContainer: {
		// position: 'absolute',
		// right: '0px
		// left: '70%',
		// right: '-5%',
		// top: '0%',
		// height:'20%',
		// width: '25%'
		flexBasis: '25%',
		justifySelf: 'flex-end',
		width: '100%',
		flexDirection: 'row'
	},
	acceptButton: {
		borderRightWidth: 0
	},
	rejectButton: {
		flexBasis: '20%',
		flexGrow: 0,
		borderRightWidth: 0
	},
	rejectIcon: {
		textAlign: 'center'
	}
});

const AddFriendIcon = style => <Icon name="friend" />;
const FriendRequestIcon = style => <Icon name="friend-request" />;
const RejectFriendIcon = style => (
	<Icon color={'white'} style={styles.rejectIcon} name="x" />
);
export const createBoxShadow = (colorPrimary, colorAlt) => {
	// const color = #3366FF
	const boxShadowVal = `inset 6px 6px 12px ${colorPrimary}, inset -6px -6px 12px ${colorAlt}`;
	return { boxShadow: boxShadowVal };
};
export default ({
	isFriend,
	onRemove,
	onAdd,
	style,
	friendStatus,
	acceptFriend,
	rejectFriend
}) => {
	const buttons = {
		remove: {
			onPress: onRemove,
			status: 'danger',
			text: 'Remove from Call',
			condition: false
		},
		add: {
			onPress: onAdd,
			status: 'success',
			icon: AddFriendIcon,
			text: 'Add Friend', // 'Add To Call',
			condition: friendStatus == null,
			boxShadowStyle: createBoxShadow('#1cac75', '#2cffbb')
		},
		accept: {
			onPress: acceptFriend,
			status: 'primary',
			icon: FriendRequestIcon,
			text: 'Accept Request',
			condition: friendStatus == 'P',
			boxShadowStyle: createBoxShadow('#2b57d9', '#3b75ff'),
			customStyles: styles.acceptButton
		},
		reject: {
			onPress: rejectFriend,
			status: 'danger',
			icon: RejectFriendIcon,
			text: '', //'Reject',
			condition: friendStatus == 'P',
			boxShadowStyle: createBoxShadow('#d93460', '#ff4682'),
			customStyles: styles.rejectButton
		}
	};
	const buttonList = Object.keys(buttons).map(key => buttons[key]);
	const activeButtons = buttonList.filter(({ condition }) => condition);

	return (
		<Layout style={styles.buttonContainer}>
			{activeButtons.map(
				({
					condition,
					text = '',
					boxShadowStyle,
					customStyles = {},
					...buttonProps
				}) => (
					<Button
						style={[style, styles.button, boxShadowStyle, customStyles]}
						{...buttonProps}
					>
						{text}
					</Button>
				)
			)}
		</Layout>
	);
	return (
		<Button
			style={[style, styles.button]}
			status="success"
			icon={AddFriendIcon}
		></Button>
	);
	return (
		<Button appearance="outline" style={buttonStyleAlt} {...restProps}>
			{text}
		</Button>
	);
};
// if (online[index].checked) {
//     taskButton = (
//         <Button
//             onPress={() => this.onRemove(index)}
//             appearance="outline"
//             status="danger"
//             style={buttonStyleAlt}
//         >
//             Remove
//         </Button>
//     );
// } else {
//     taskButton = (
//         <Button
//             status="success"
//             appearance="outline"
//             onPress={() => this.onAdd(index)}
//             style={buttonStyleAlt}
//         >
//             Add To Call
//         </Button>
//     );
// }
