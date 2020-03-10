import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import * as CallSelectors from '../selectors/call';
import * as UserSelectors from '../selectors/users';
import UserItem from './UserItem';
import AddToCallButton from '../components/buttons/AddToCall';
import AddRemoveFriendButton from '../components/buttons/AddRemoveFriend';

import {
	Layout,
	Text,
	Button,
	ButtonGroup,
	styled,
	Icon,
	List,
	ListItem,
	withStyles,
	Toggle
} from 'react-native-ui-kitten';
import { loadData } from '@src/actions';
import AddRemoveFriend from '@src/components/buttons/AddRemoveFriend';
const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	userListLayout: {
		width: '100%',
		// overflowY: 'scroll',
		height: '80vh'
	},
	row: {
		padding: 15,
		width: '100%',
		alignItems: 'center'
	},
	userBlock: {
		flex: 1,
		flexBasis: 50,
		flexDirection: 'row',
		borderRadius: 10,
		borderStyle: 'solid',
		borderWidth: 0.5,
		borderColor: '#4C3C1B',
		margin: 1,
		padding: 15,
		height: 'auto',
		width: 'auto',
		flexShrink: 1
	},
	column: {
		padding: 15,
		height: 'auto',
		width: 'auto',
		flexBasis: 'auto',
		flexShrink: 0,
		flexGrow: 1
	},
	button: {
		flex: 1
	},
	buttonBottom: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	pseudoButtonGroup: {
		maxWidth: '50%',
		display: 'flex'
	},
	list: {
		width: '100%'
	},
	listContentContainer: {
		// flexShrink: 1,
		// flexDirection: 'row',
		// flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	// REMOVe
	listItem: {
		margin: 8,
		borderRadius: 12,
		boxShadow: `-8px 8px 16px #111522, 8px -8px 16px #334168;`,
		// LATEST boxShadow: `-23px 23px 46px #171d2f, 23px -23px 46px #2d395b`,
		backgroundColor: `linear-gradient(225deg, #242e4a, #1f273e)`,

		// boxShadow: `20px 60px #171d2f, -20px -20px 60px #2d395b`
		flexBasis: '45%',
		flexGrow: 1
		// flexShrink: 1
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 1 },
		// shadowOpacity: 0.8,
		// shadowRadius: 1,
	},
	columnWrapper: {
		flexBasis: 100,
		flexGrow: 1,
		flexShrink: 1
	}
});
class UsersList extends React.Component {
	constructor(props) {
		super();
		this.state = {
			checked: [false]
		};
		this.onAdd = this.onAdd.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.addFriend = this.addFriend.bind(this);
		this.removeFriend = this.removeFriend.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.renderItemAccessory = this.renderItemAccessory.bind(this);
		this.renderItemIcon = this.renderItemIcon.bind(this);
	}
	goTalk() {
		console.log('UsersList');
		this.props.setTabView(2);
	}
	onAdd(index) {
		debugger; //remove
		// REACTIVATE
		// const { addToCall } = this.props;
		// const user = this.getUserFromIndex(index);
		// addToCall(index, user);
	}
	onRemove(index) {
		const { removeFromCall } = this.props;
		const user = this.getUserFromIndex(index);
		removeFromCall(index, user);
	}
	addFriend(index) {
		const { addFriend } = this.props;
		const user = this.getUserFromIndex(index);
		addFriend(user);
	}
	removeFriend(index) {
		const { removeFriend } = this.props;
		const user = this.getUserFromIndex(index);
		removeFriend(user);
	}
	getUserFromIndex(index) {
		return this.props.users[index];
	}
	calculateHeights() {
		const { mobile, baseHeight, incomingCallPending } = this.props;
		const extraSpace = incomingCallPending ? 0.1 : 0;
		const baseHeightMultiplier = mobile ? 0.9 : 1;
		const heightMultiplier = baseHeightMultiplier - extraSpace;
		return baseHeight * heightMultiplier;
	}
	renderItem({ item: user, index, ...restProps }) {
		if (true == true) {
			return (
				<UserItem
					themedStyle={this.props.themedStyle}
					username={user}
					index={index}
					onAdd={this.onAdd}
					{...restProps}
				/>
			);
		}
		const { themedStyle } = this.props;
		console.log('render item', user);
		const { username, src = {} } = user;
		const { displayName = '' } = src;
		const iconColor = themedStyle['iconOnline'].color;
		// const checked =
		const border = user.checked ? { borderWidth: 2, borderColor: iconColor } : {};
		return (
			// <TouchableOpacity onPress={this.onAdd}>

			<ListItem
				title={`${username}`}
				description={`${displayName}`}
				icon={this.renderItemIcon}
				key={index}
				// accessory={renderItemAccessory}
				style={[styles.listItem, border]}
				onClick={() => this.onAdd(index)}
			/>
			// </TouchableOpacity>
		);
	}
	renderItemAccessory(style, index) {
		const buttonStyleAlt = [style, styles.button];
		const { checked } = this.state;
		const renderButtons = [];
		const user = this.getUserFromIndex(index);
		if (user.isFriend || !user.isFriend) {
			renderButtons.push(
				<AddToCallButton
					checked={user.checked}
					onAdd={this.onAdd}
					onRemove={this.onRemove}
					otherStyles={style}
					key={`callbutton${index}`}
					index={index}
				/>
			);
		}
		// else {
		// 	renderButtons.push(
		// 		<AddRemoveFriendButton
		// 			friend={false}

		// 		/>
		// 	)
		// }
		return (
			<Layout style={[themedStyle.pseudoButtonGroup, styles.pseudoButtonGroup]}>
				{renderButtons.map(button => button)}
			</Layout>
		);
	}
	renderItemIcon(style, index) {
		const { themedStyle } = this.props;
		console.log(style, index);
		const user = this.getUserFromIndex(index);

		const style2 = {
			width: 5, //style.width, // CHANGE THIS
			height: 5, //style.height, // CHANGE
			// marginHorizontal: style.marginHorizontal
			margin: 0
			// color: 'black'
			// color: themedStyle.icons.color,
			// backgroundColor: themedStyle.icons.color,
		};
		const iconKey = user.online ? 'iconOnline' : 'iconOffline';
		const iconColor = themedStyle[iconKey].color;
		return (
			<Icon
				{...style2}
				// style={{ color: themedStyle.icons.color }}
				name="circle"
				solid
				color={iconColor}
			/>
		);
	}
	render() {
		const {
			themedStyle,
			baseHeight,
			incomingCallPending,
			users
			// orderedUsers
		} = this.props;

		// const renderItemAccessory = (style, index) => {
		// 	const buttonStyleAlt = [style, styles.button];
		// 	const { checked } = this.state;
		// 	const renderButtons = [];
		// 	const user = this.getUserFromIndex(index);
		// 	if (user.isFriend || !user.isFriend) {
		// 		renderButtons.push(
		// 			<AddToCallButton
		// 				checked={user.checked}
		// 				onAdd={this.onAdd}
		// 				onRemove={this.onRemove}
		// 				otherStyles={style}
		// 				key={`callbutton${index}`}
		// 				index={index}
		// 			/>
		// 		);
		// 	}
		// 	// else {
		// 	// 	renderButtons.push(
		// 	// 		<AddRemoveFriendButton
		// 	// 			friend={false}

		// 	// 		/>
		// 	// 	)
		// 	// }
		// 	return (
		// 		<Layout style={[themedStyle.pseudoButtonGroup, styles.pseudoButtonGroup]}>
		// 			{renderButtons.map(button => button)}
		// 		</Layout>
		// 	);
		// };

		// const renderItemIcon = (style, index) => {
		// 	console.log(style, index);
		// 	const user = this.getUserFromIndex(index);

		// 	const style2 = {
		// 		width: 5,//style.width, // CHANGE THIS
		// 		height: 5,//style.height, // CHANGE
		// 		// marginHorizontal: style.marginHorizontal
		// 		margin: 0
		// 		// color: 'black'
		// 		// color: themedStyle.icons.color,
		// 		// backgroundColor: themedStyle.icons.color,
		// 	};
		// 	const iconKey = user.online ? 'iconOnline' : 'iconOffline';
		// 	const iconColor = themedStyle[iconKey].color;
		// 	return (
		// 		<Icon
		// 			{...style2}
		// 			// style={{ color: themedStyle.icons.color }}
		// 			name="circle"
		// 			solid
		// 			color={iconColor}
		// 		/>
		// 	);
		// };

		// const renderItem = ({ item: user, index }) => {
		// 	console.log('render item', user);
		// 	const { username, src = {} } = user;
		// 	const { displayName = '' } = src;
		// 	const iconColor = themedStyle['iconOnline'].color;
		// 	// const checked =
		// 	const border = user.checked ? { borderWidth: 2, borderColor: iconColor } : {};
		// 	return (
		// 		// <TouchableOpacity onPress={this.onAdd}>

		// 		<ListItem
		// 			title={`${username}`}
		// 			description={`${displayName}`}
		// 			icon={renderItemIcon}
		// 			key={index}
		// 			// accessory={renderItemAccessory}
		// 			style={[styles.listItem, border]}
		// 			onClick={() => this.onAdd(index)}
		// 		/>
		// 		// </TouchableOpacity>
		// 	);
		// };

		const derivedHeight = this.calculateHeights();
		return (
			<Layout style={[styles.userListLayout, { height: derivedHeight }]}>
				<List
					data={users}
					renderItem={this.renderItem}
					// renderItem={UserItem}
					style={styles.list}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContentContainer}
					// horizontal={true}
					numColumns={2}
					columnWrapperStyle={styles.columnWrapper}
				/>
			</Layout>
		);
	}
}

export const UsersListWithStyles = withStyles(UsersList, theme => ({
	buttonGroup: {
		backgroundColor: theme['color-primary-100'],
		marginHorizontal: 0
	},
	iconOnline: {
		backgroundColor: theme['color-primary-100'],
		// color: theme['color-basic-800']
		color: theme['color-success-500']
	},
	iconOffline: {
		backgroundColor: theme['color-primary-100'],
		// color: theme['color-basic-800']
		color: theme['color-success-500'] // CHANGE THIS!
	},
	container: { backgroundColor: '#1A2138' },
	action: { marginHorizontal: 4 },
	removeButton: {
		color: theme['color-danger-500']
	},
	pseudoButtonGroup: {
		display: 'flex',
		flexDirection: 'row'
	}
}));

const mapDispatchToProps = dispatch => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab)),
		addToCall: (index, user) => dispatch(Actions.addToCall(index, user)),
		removeFromCall: (index, user) =>
			dispatch(Actions.removeFromCall(index, user)),
		addFriend: user => dispatch(Actions.addFriend(user)),
		removeFriend: user => dispatch(Actions.removeFriend(user))
	};
};
const mapStateToProps = state => {
	const { view } = state;
	const { tab, mobile } = view;
	const visibleUsers = UserSelectors.getVisibleUsers(state) || [];
	// const orderedUsers =
	// 	visibleUsers && visibleUsers.online
	// 		? visibleUsers.online.concat(visibleUsers.offline)
	// 		: [];
	return {
		tab,
		mobile,
		incomingCallPending: CallSelectors.incomingCallPending(state),
		// friends: users.friends,
		users: visibleUsers
		// orderedUsers
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListWithStyles);

// RMEMOVE THIS, change talk button to this
// const = `border-radius: 50px;
// background: linear-gradient(315deg, #376dff, #2e5ce6);
// box-shadow:  -14px -14px 28px #1f3e9c,
//              14px 14px 28px #478eff;
// `
