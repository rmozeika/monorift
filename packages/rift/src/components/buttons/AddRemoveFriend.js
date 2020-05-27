import * as React from 'react';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity } from 'react-native';

const AddFriendIcon = ({
	style = {},
	size = 20,
	//color = '#E4E9F2'
	color = 'rgb(0, 224, 150)'
}) => {
	return <Icon name="friend" size={size} color={color} />;
};
const FriendRequestSentIcon = ({
	style = {},
	size = 20,
	color = 'rgb(16, 20, 38)'
}) => {
	const name = 'friend-sent-alt' || 'ellipsis' || 'check' || 'friend-sent';
	return <Icon name={name} size={size} color={color} />;
};
const FriendRequestIcon = ({ style }) => (
	<Icon size={style.height} color={style.tintColor} name="friend-request" />
);
const RejectFriendIcon = ({ style = {}, size = 20, color = '#E4E9F2' }) => (
	<Icon size={20} color={color} style={style} name="x" />
);
const AcceptFriendIcon = ({ style = {}, size = 20, color = '#E4E9F2' }) => (
	<Icon size={20} color={color} style={style} name={'check'} />
);

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
					textStyle: styles.addText,
					text: 'add'
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
const successColor = 'rgba(0, 224, 150, 0.94)'; // 'rgb(0, 224, 150)'
const touchableStyle = {
	flex: 1,
	margin: 0,
	minWidth: 65,
	flexBasis: 50,
	flexGrow: 1,
	maxHeight: 40,
	// height: '80%',
	// boxShadow:"inset 6px 6px 12px #1cac75, inset -6px -6px 12px #2cffbb",
	// borderRadius: 10,
	borderWidth: 1,
	borderBottomLeftRadius: 10,
	borderBottomRightRadius: 10,
	// color: '#EDF1F7',
	color: '#C5CEE0',

	flexDirection: 'row',
	// flexDirection: 'row',
	alignItems: 'center',
	textAlign: 'center',
	alignSelf: 'flex-start',
	// justifyContent: 'center',
	justifyContent: 'space-evenly',
	// marginRight: 5,
	height: 40,
	width: 40,
	// height: 75,
	// width: 75,
	//flexGrow: 0,
	margin: 0,
	backgroundColor: 'inherhit',
	alignSelf: 'flex-end',
	marginRight: 10,
	// borderBottomRightRadius: 0,
	minHeight: 40,
	minWidth: 70
};
const styles = StyleSheet.create({
	addText: {
		color: 'rgb(0, 224, 150)' //'#EDF1F7'
	},
	sentText: {
		color: 'rgb(16, 20, 38)' //'#C5CEE0'
	},
	touchable: {
		flex: 1,
		margin: 0,
		minWidth: 10,
		height: '50%',
		borderRadius: 0,
		// color: '#EDF1F7',
		color: '#C5CEE0',
		flexDirection: 'column'
	},
	iconAdd: {
		color: '#C5CEE0' //'rgb(0, 224, 150)'
	},
	iconSent: {
		// color: '#C5CEE0',
		color: 'rgb(16, 20, 38)' // '#EDF1F7'
	},
	touchableAdd: {
		...touchableStyle,
		// height: 40,
		// width: 40,
		// flexGrow: 0,
		// margin: 0,
		// borderWidth: 2,
		// borderColor: '#1cac75',
		borderColor: successColor,
		backgroundColor: successColor, //'rgb(0, 224, 150)',
		borderWidth: 1,
		backgroundColor: 'rgba(44, 255, 187, 0.05)',
		borderColor: 'rgba(0, 224, 150, 0.18)'
		// margin
		// borderRadius: 0
		// color: '#C5CEE0',
		// justifyContent: 'space-evenly'
	},
	touchableSent: {
		...touchableStyle,
		// borderColor: 'rgba(51, 102, 255, 0.48)',
		borderWidth: 0,
		backgroundColor: 'rgba(143, 155, 179, 0.5)', //'#EDF1F7', //'rgba(51, 102, 255, 0.1)',
		color: '#C5CEE0',
		opacity: 1
	},
	touchableAccept: {
		...touchableStyle,
		// borderColor: 'rgba(0, 224, 150, 0.48)',
		// backgroundColor: 'rgba(44, 255, 187, 0.05)',
		borderColor: successColor,
		backgroundColor: successColor,
		marginBottom: 2
	},
	touchableCancel: {
		...touchableStyle,
		// borderColor: 'rgba(255, 61, 113, 0.48)',
		backgroundColor: '#FF3D71',
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		marginTop: 2
	},
	buttonContainer: {
		flexBasis: '25%',
		// justifySelf: 'flex-end',
		flexDirection: 'column'
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
