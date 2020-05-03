import * as React from 'react';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity } from 'react-native';

const AddFriendIcon = ({
	style = {},
	size = 20,
	color = 'rgb(0, 224, 150)'
}) => {
	return <Icon name="friend" size={size} color={color} />;
};
const FriendRequestSentIcon = ({
	style = {},
	size = 20,
	color = '#C5CEE0'
}) => {
	const name = 'friend-sent-alt' || 'ellipsis' || 'check' || 'friend-sent';
	return <Icon name={name} size={size} color={color} />;
};
const FriendRequestIcon = ({ style }) => (
	<Icon size={style.height} color={style.tintColor} name="friend-request" />
);
const RejectFriendIcon = ({ style = {}, size = 20, color = '#FF3D71' }) => (
	<Icon size={20} color={color} style={style} name="x" />
);
const AcceptFriendIcon = ({
	style = {},
	size = 20,
	color = 'rgb(0, 224, 150)'
}) => <Icon size={20} color={color} style={style} name={'check'} />;

export const createBoxShadow = (colorPrimary, colorAlt) => {
	// const color = #3366FF
	const boxShadowVal = `inset 6px 6px 12px ${colorPrimary}, inset -6px -6px 12px ${colorAlt}`;
	return { boxShadow: boxShadowVal };
};
function FriendButton({ text, icon, ...props }) {
	return (
		<Button accessoryLeft={icon} {...props}>
			<Text>{text}</Text>
		</Button>
	);
}
class AddRmFriend extends React.PureComponent {
	constructor(props) {
		super(props);
		console.log(`created friend buttons ${this.props.user}`);
	}
	get buttonProps() {
		const buttons = {
			[null]: {
				// condition: this.props.friendStatus == null,
				type: 'add',
				// onPress: this.props.onAdd,
				props: {
					Accessory: AddFriendIcon,
					onPress: this.addFriend, //this.clickHandler,

					// status: 'success',
					// text: 'Add Friend', // 'Add To Call',
					style: styles.touchableAdd,
					textStyle: styles.sentText

					// boxShadowStyle: createBoxShadow('#1cac75', '#2cffbb')
				}
			},
			['S']: {
				type: 'sent',
				props: {
					onPress: () => {},
					Accessory: FriendRequestSentIcon,
					// state: 'primary',
					text: 'sent',
					style: styles.touchableSent,
					textStyle: styles.sentText
				}
				// negative: {
				// 	Accessory: RejectFriendIcon,
				// 	style: styles.touchableCancel,
				// 	onPress: () => {}
				// }

				// condition: friendStatus == 'S'
			},
			// remove: {
			// 	onPress: onRemove,
			// 	status: 'danger',
			// 	text: 'Remove from Call',
			// 	condition: false
			// },

			['P']: {
				type: 'accept',
				props: {
					// icon: FriendRequestIcon,
					Accessory: AcceptFriendIcon,
					onPress: this.acceptFriend,
					// text: 'Accept Request',
					style: styles.touchableAccept

					// condition: friendStatus == 'P',
					// boxShadowStyle: createBoxShadow('#2b57d9', '#3b75ff'),
					// customStyles: styles.acceptButton
					// status: 'primary',
				},
				negative: {
					Accessory: RejectFriendIcon,
					style: styles.touchableCancel,
					onPress: this.rejectFriend
				}
			},
			['A']: null
			// reject: {
			// 	onPress: rejectFriend,
			// 	status: 'danger',
			// 	icon: RejectFriendIcon,
			// 	text: '', //'Reject',
			// 	condition: friendStatus == 'P',
			// 	boxShadowStyle: createBoxShadow('#d93460', '#ff4682'),
			// 	customStyles: styles.rejectButton
			// }
		};
		return buttons[this.props.friendStatus];
	}
	buttons = {
		[null]: {
			// condition: this.props.friendStatus == null,
			type: 'add',
			// onPress: this.props.onAdd,
			props: {
				// icon: AddFriendIcon,
				onPress: this.addFriend, //this.clickHandler,
				// status: 'success',
				text: 'Add Friend' // 'Add To Call',
				// boxShadowStyle: createBoxShadow('#1cac75', '#2cffbb')
			}
		},
		['S']: {
			type: 'sent',
			props: {
				onPress: () => {},
				// state: 'primary',
				text: 'sent'
			}

			// condition: friendStatus == 'S'
		},
		// remove: {
		// 	onPress: onRemove,
		// 	status: 'danger',
		// 	text: 'Remove from Call',
		// 	condition: false
		// },

		['P']: {
			type: 'accept',
			props: {
				// icon: FriendRequestIcon,
				onPress: this.acceptFriend,
				text: 'Accept Request'
				// condition: friendStatus == 'P',
				// boxShadowStyle: createBoxShadow('#2b57d9', '#3b75ff'),
				// customStyles: styles.acceptButton
				// status: 'primary',
			}
		}
		// reject: {
		// 	onPress: rejectFriend,
		// 	status: 'danger',
		// 	icon: RejectFriendIcon,
		// 	text: '', //'Reject',
		// 	condition: friendStatus == 'P',
		// 	boxShadowStyle: createBoxShadow('#d93460', '#ff4682'),
		// 	customStyles: styles.rejectButton
		// }
	};
	clickHandlers = {};
	cacheClickHandlers(id) {
		return id;
	}
	clickHandler() {
		console.log('clicked');
	}
	addFriend = e => {
		// e.stopPropagation();
		const { addFriend } = this.props;
		addFriend();
	};
	respondFriendRequest = didAccept => {
		const { respondFriendRequest, user } = this.props;
		respondFriendRequest(user, didAccept);
	};
	acceptFriend = () => {
		// e.stopPropagation();
		this.respondFriendRequest(true);
	};
	rejectFriend = () => {
		// e.stopPropagation();
		this.respondFriendRequest(false);
	};
	removeFriend = () => {
		const { removeFriend, user } = this.props;
		removeFriend(user);
	};
	render() {
		console.log(`rendered friend buttons ${this.props.user}`);
		const { props, negative } = this.buttonProps;
		if (!props) {
			return null;
		}
		return (
			<Layout style={styles.buttonContainer}>
				{/* <AcceptButton onPress={this.clickHandler} /> */}
				{/* <FriendButton {...this.buttons.add.props} /> */}
				{/* <AcceptTouchable onPress={this.addFriend} /> */}
				{/* <FriendTouchable {...this.buttons[this.props.friendStatus].props} /> */}
				<FriendTouchable {...props} />
				{negative && <FriendTouchable {...negative} />}
			</Layout>
		);
	}
}
const AddRemoveFriend = ({
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
		sent: {
			onPress: () => {},
			state: 'primary',
			text: 'sent',
			condition: friendStatus == 'S'
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
	// const buttonList = Object.keys(buttons).map(key => ({ ...buttons[key], key }));
	// const activeButtons = buttonList.filter(({ condition }) => condition);
	return (
		<Layout style={styles.buttonContainer}>
			<TouchableOpacity
				// key={key}
				// status={'success'}
				style={styles.button}
				onPress={onAdd}
			>
				<Text>Add Friend</Text>
			</TouchableOpacity>
			{/* <AcceptButton onPress={buttons.accept.onPress} ></AcceptButton> */}
		</Layout>
	);
	{
		/* return (
		<Layout style={styles.buttonContainer}>
			{activeButtons.map(
				({
					condition,
					key,
					text = '',
					boxShadowStyle,
					customStyles = {},
					...buttonProps
				}) => (
					<Button
						key={key}
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
	); */
	}
};
const AcceptTouchable = ({ onPress }) => (
	<TouchableOpacity
		// key={key}
		// status={'success'}
		style={styles.touchable}
		onPress={onPress}
	>
		<Text>Add Friend</Text>
	</TouchableOpacity>
);

const FriendTouchable = ({
	negative,
	text,
	onPress,
	style,
	textStyle,
	Accessory
}) => {
	return (
		<TouchableOpacity
			// key={key}
			// status={'success'}
			style={style}
			onPress={onPress}
		>
			{Accessory && <Accessory />}
			{text && <Text style={textStyle}>{text}</Text>}
		</TouchableOpacity>
	);
};
const AcceptButton = ({ onPress }) => (
	<Button
		// key={key}
		status={'success'}
		style={styles.button}
		onPress={onPress}
	>
		<Text>Add Friend</Text>
	</Button>
);
const buttonStyle = {
	flex: 1,
	margin: 0,
	marginRight: 0,
	minWidth: 10,
	height: '100%',
	boxShadow: `inset 6px 6px 12px #1cac75, inset -6px -6px 12px #2cffbb`,
	borderRadius: 0,
	color: '#EDF1F7',
	flexDirection: 'column'
};

const touchableStyle = {
	flex: 1,
	margin: 0,
	minWidth: 10,
	flexBasis: 50,
	// height: '80%',
	// boxShadow:"inset 6px 6px 12px #1cac75, inset -6px -6px 12px #2cffbb",
	borderRadius: 10,
	borderWidth: 1,

	// color: '#EDF1F7',
	color: '#C5CEE0',

	flexDirection: 'column',
	// flexDirection: 'row',
	alignItems: 'center',
	textAlign: 'center',
	alignSelf: 'center',
	// justifyContent: 'center',
	justifyContent: 'space-evenly',
	// marginRight: 5,
	height: 40,
	width: 40,
	// height: 75,
	// width: 75,
	flexGrow: 0,
	margin: 0,
	backgroundColor: 'inherhit'
};
const styles = StyleSheet.create({
	button: {
		flex: 1,
		margin: 0,
		marginRight: 0,
		minWidth: 10,
		height: '100%',
		boxShadow: `inset 6px 6px 12px #1cac75, inset -6px -6px 12px #2cffbb`,
		borderRadius: 0,
		color: '#EDF1F7',
		flexDirection: 'column'
	},
	sentText: {
		color: '#C5CEE0'
	},
	touchable: {
		flex: 1,
		margin: 0,
		minWidth: 10,
		height: '50%',
		// boxShadow:"inset 6px 6px 12px #1cac75, inset -6px -6px 12px #2cffbb",
		borderRadius: 0,
		// color: '#EDF1F7',
		color: '#C5CEE0',
		flexDirection: 'column'
	},
	iconAdd: {
		color: 'rgb(0, 224, 150)'
	},
	iconSent: {
		color: '#C5CEE0'
	},
	touchableAdd: {
		...touchableStyle,
		// height: 40,
		// width: 40,
		// flexGrow: 0,
		// margin: 0,
		// borderWidth: 2,
		// borderColor: '#1cac75',
		borderColor: 'rgb(0, 224, 150)',
		backgroundColor: 'rgba(44, 255, 187, 0.05)'
		// color: '#C5CEE0',
		// justifyContent: 'space-evenly'
	},
	touchableSent: {
		...touchableStyle,
		// borderColor: 'rgba(51, 102, 255, 0.48)',
		borderWidth: 0,
		backgroundColor: 'inherhit', //'rgba(51, 102, 255, 0.1)',
		color: '#C5CEE0'
	},
	touchableAccept: {
		...touchableStyle,
		borderColor: 'rgb(0, 224, 150)',
		backgroundColor: 'rgba(44, 255, 187, 0.05)',
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0
	},
	touchableCancel: {
		...touchableStyle,
		borderColor: 'rgba(255, 61, 113, 0.48)',
		backgroundColor: 'rgba(255, 61, 113, 0.1)',
		marginRight: 5,
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0
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
		// width: '100%',
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

export default AddRmFriend;
