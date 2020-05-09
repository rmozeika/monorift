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
class AddRemoveFriend extends React.PureComponent {
	constructor(props) {
		super(props);
	}
	get buttonProps() {
		const buttons = {
			[null]: {
				type: 'add',
				props: {
					Accessory: AddFriendIcon,
					onPress: this.addFriend,
					style: styles.touchableAdd,
					textStyle: styles.sentText
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
			['P']: {
				type: 'accept',
				props: {
					Accessory: AcceptFriendIcon,
					onPress: this.acceptFriend,
					style: styles.touchableAccept
				},
				negative: {
					Accessory: RejectFriendIcon,
					style: styles.touchableCancel,
					onPress: this.rejectFriend
				}
			},
			['A']: { empty: true },
			[undefined]: { empty: true }
		};
		return buttons[this.props.friendStatus];
	}
	addFriend = e => {
		// e.stopPropagation();
		const { addFriend } = this.props;
		addFriend();
	};
	acceptFriend = () => {
		// e.stopPropagation();
		this.props.acceptFriend();
	};
	rejectFriend = () => {
		// e.stopPropagation();
		this.props.rejectFriend();
	};
	removeFriend = () => {
		const { removeFriend, user } = this.props;
		removeFriend(user);
	};
	render() {
		const { props, negative, empty } = this.buttonProps;
		if (empty) {
			return null;
		}
		return (
			<Layout style={styles.buttonContainer}>
				<FriendTouchable {...props} />
				{negative && <FriendTouchable {...negative} />}
			</Layout>
		);
	}
}

const FriendTouchable = ({ text, onPress, style, textStyle, Accessory }) => {
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

export default AddRemoveFriend;
