import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import * as CallSelectors from '../selectors/call';
import * as UserSelectors from '../selectors/users';

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
	}
	goTalk() {
		console.log('UsersList');
		this.props.setTabView(2);
	}
	onAdd(index) {
		const { addToCall } = this.props;
		const user = this.getUserFromIndex(index);
		addToCall(index, user);
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
		return this.props.orderedUsers[index];
	}
	calculateHeights() {
		const { mobile, baseHeight, incomingCallPending } = this.props;
		const extraSpace = incomingCallPending ? 0.1 : 0;
		const baseHeightMultiplier = mobile ? 0.9 : 1;
		const heightMultiplier = baseHeightMultiplier - extraSpace;
		return baseHeight * heightMultiplier;
	}
	render() {
		const {
			online,
			themedStyle,
			baseHeight,
			incomingCallPending,
			friends,
			users,
			orderedUsers
		} = this.props;

		const renderItemAccessory = (style, index) => {
			const buttonStyleAlt = [style, styles.button];
			const { checked } = this.state;
			const renderButtons = [];
			const user = this.getUserFromIndex(index);
			if (user.isFriend) {
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
		};

		const renderItemIcon = (style, index) => {
			console.log(style, index);
			const user = this.getUserFromIndex(index);

			const style2 = {
				width: style.width,
				height: style.height,
				marginHorizontal: style.marginHorizontal
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
		};

		const renderItem = ({ item: user, index }) => {
			console.log(user);
			const { username, src = {} } = user;
			const { displayName = '' } = src;
			return (
				<ListItem
					title={`${username}`}
					description={`${displayName}`}
					icon={renderItemIcon}
					accessory={renderItemAccessory}
				/>
			);
		};

		const derivedHeight = this.calculateHeights();
		return (
			<Layout style={[styles.userListLayout, { height: derivedHeight }]}>
				<List
					data={orderedUsers}
					renderItem={renderItem}
					style={{ width: '100%', flexShrink: 1 }}
					showsVerticalScrollIndicator={false}
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

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab)),
		addToCall: (index, user) => dispatch(Actions.addToCall(index, user)),
		removeFromCall: (index, user) =>
			dispatch(Actions.removeFromCall(index, user)),
		addFriend: user => dispatch(Actions.addFriend(user)),
		removeFriend: user => dispatch(Actions.removeFriend(user))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { view, peerStore, users } = state;
	const { tab, mobile } = view;
	const visibleUsers = UserSelectors.getVisibleUsers(state);
	const orderedUsers =
		visibleUsers && visibleUsers.online
			? visibleUsers.online.concat(visibleUsers.offline)
			: [];
	return {
		tab,
		mobile,
		incomingCallPending: CallSelectors.incomingCallPending(state),
		friends: users.friends,
		users: visibleUsers,
		orderedUsers
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListWithStyles);
