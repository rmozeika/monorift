import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { getUser } from '../selectors/users';
import AddToCallButton from '../components/buttons/AddToCall';
import AddRemoveFriendButton from '../components/buttons/AddRemoveFriend';
import Gravatar from '../components/users/Gravatar';
const styles = StyleSheet.create({
	listItem: {
		margin: 4,
		borderRadius: 12,
		// boxShadow: `-8px 8px 5px #111522, 8px -8px 5px #334168;`,
		boxShadow: ` 8px 8px 5px #161c30, 
		-8px -8px 5px #1e2640`,

		// LATEST boxShadow: `-23px 23px 46px #171d2f, 23px -23px 46px #2d395b`,
		backgroundColor: `linear-gradient(225deg, #242e4a, #1f273e)`,

		// boxShadow: `20px 60px #171d2f, -20px -20px 60px #2d395b`
		flexBasis: '45%',
		flexGrow: 1,
		// flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		// flexShrink: 1
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 1 },
		// shadowOpacity: 0.8,
		// shadowRadius: 1,
		padding: 0,
		paddingHorizontal: 0,
		paddingVertical: 0,
		zIndex: 9,
		// MAY NEED TO DIABLE -REACTIVATE FOR FLEX POSITION
		alignContent: 'flex-end'
		// marginHorizontal: 0,
		// marginVertical:0
	},
	listItemMain: {
		backgroundColor: 'inherhit',
		flexBasis: '50%',
		zIndex: 10,
		// MAY NEED TO REACTIVATE FOR FLEX POSITION
		// height: '55%',
		justifyContent: 'center',
		alignSelf: 'center',
		display: 'flex',
		flexDirection: 'row',
		alignContent: 'center',
		width: '100%',
		flexGrow: 1
		// justifyContent: 'center'
	},
	gravatarContainer: {
		flexBasis: '40%',
		backgroundColor: 'inherit',
		// alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'flex-end'
		// borderRadius: '50%',
	},
	// gravatarContainerOnline: {

	// }
	titleContainer: {
		flexBasis: '50%',
		flexGrow: 1,
		backgroundColor: 'inherit',
		alignContent: 'center',
		justifyContent: 'center'
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
		width: '100%'
	},
	statusBar: {
		flexBasis: '15%',
		// flexBasis: '100%',
		textAlign: 'center',
		borderTopRightRadius: 4,
		borderTopRightRadius: 4,
		justifySelf: 'flex-end',
		width: '100%'
	},
	listItemTitle: {
		fontSize: 13,
		fontWeight: 600,
		textAlign: 'start',
		alignContent: 'center',
		paddingLeft: 10
	},
	listItemDetails: {
		fontSize: 10,
		fontWeight: 400,
		textAlign: 'start',
		alignContent: 'center',
		paddingRight: 20
		// paddingLeft: 10
	},

	icon: {
		width: 24,
		height: 24,
		marginHorizontal: 8,
		tintColor: '#8F9BB3'
		// position: 'absolute'
	},
	iconContainer: {
		position: 'absolute',
		// left: '-100px'
		top: -140,
		left: -150
		// left: '-180px'
	},
	activityContainer: {
		position: 'absolute',
		// left: '-100px'
		left: '5%',
		// top: '50%',
		backgroundColor: 'inherit',
		zIndex: 20,
		top: '5%'
		// left:
	},
	button: {
		flex: 1
	},
	listItemTouchable: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row'
	},
	// REMOVE
	pseudoButtonGroup: {
		maxWidth: '50%',
		display: 'flex'
	}
});
class UserItem extends React.PureComponent {
	constructor(props) {
		super(props);
		this.addUserToCall = this.addUserToCall.bind(this);
		this.removeUserFromCall = this.removeUserFromCall.bind(this);
		this.addFriend = this.addFriend.bind(this);
		this.removeFriend = this.removeFriend.bind(this);
		this.acceptFriend = this.acceptFriend.bind(this);
		this.rejectFriend = this.rejectFriend.bind(this);
		this.respondFriendRequest = this.respondFriendRequest.bind(this);
	}
	addFriend(e) {
		// e.stopPropagation();
		const { addFriend, user } = this.props;
		addFriend(user);
	}
	respondFriendRequest(didAccept) {
		const { respondFriendRequest, user } = this.props;
		respondFriendRequest(user, didAccept);
	}
	acceptFriend() {
		// e.stopPropagation();
		this.respondFriendRequest(true);
	}
	rejectFriend() {
		// e.stopPropagation();
		this.respondFriendRequest(false);
	}
	removeFriend() {
		const { removeFriend, user } = this.props;
		removeFriend(user);
	}
	addUserToCall() {
		const { user, addToCall, index } = this.props;
		addToCall(index, user);
	}
	removeUserFromCall() {
		const { user, removeFromCall, index } = this.props;
		removeFromCall(index, user);
	}

	render() {
		const { username, index, themedStyle, user } = this.props;

		const { src = {}, checked, online } = user;
		const { displayName = '' } = src;
		const onlineBorderColor = themedStyle['iconOnline'].color;
		const border = user.checked
			? { borderWidth: 3, borderColor: onlineBorderColor }
			: {};
		const otherProps = {};

		const listHeader = () => (
			<Layout>
				<Text>Header</Text>
			</Layout>
		);

		return (
			<ListItem key={index} style={[styles.listItem, border, { padding: 0 }]}>
				<Layout style={styles.listItemMain}>
					<TouchableOpacity
						onClick={checked ? this.removeUserFromCall : this.addUserToCall}
						style={styles.listItemTouchable}
					>
						<Gravatar
							style={styles.gravatarContainer}
							online={online}
							username={username}
							onlineBorderColor={onlineBorderColor}
						/>
						<Layout style={styles.titleContainer}>
							<Text style={styles.listItemTitle}>{username}</Text>
							{/* <Text style={styles.listItemDetails}>online</Text> */}
						</Layout>
					</TouchableOpacity>
				</Layout>
				{user.online && (
					<Layout style={[styles.statusBar, themedStyle.statusBar]}>
						<Text style={themedStyle.statusText}>online</Text>
					</Layout>
				)}
				{user.friendStatus !== 'A' && (
					<AddRemoveFriendButton
						onAdd={this.addFriend}
						removeFriend={this.removeFriend}
						isFriend={user.isFriend}
						friendStatus={user.friendStatus}
						acceptFriend={this.acceptFriend}
						rejectFriend={this.rejectFriend}
						// style={buttonStyleAlt}
					/>
				)}
			</ListItem>
		);
	}
}
const mapStateToProps = (state, props) => {
	// const { }
	return {
		user: getUser(state, props)
	};
};
const mapDispatchToProps = dispatch => {
	return {
		addToCall: (index, user) => dispatch(Actions.addToCall(index, user)),
		removeFromCall: (index, user) =>
			dispatch(Actions.removeFromCall(index, user)),
		addFriend: user => dispatch(Actions.addFriend(user)),
		removeFriend: user => dispatch(Actions.removeFriend(user)),
		respondFriendRequest: (user, didAccept) =>
			dispatch(Actions.respondFriendRequest(user, didAccept))
		// dispatch(actionCreator)
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(UserItem);
