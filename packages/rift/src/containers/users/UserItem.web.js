import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import { getUser } from '@selectors/users';
import AddToCallButton from '@components/buttons/AddToCall';
import AddRemoveFriendButton from '@components/buttons/AddRemoveFriend';
import Gravatar from '@components/users/Gravatar';
import QuickCall from '@components/buttons/QuickCall';

//REMOEV
import AddRmTest from '@components/buttons/AddRmTest';
class UserItem extends React.Component {
	constructor(props) {
		super(props);
		// remove
		this.state = { gravatarRendered: false };
	}
	shouldComponentUpdate(nextProps) {
		if (this.props.user !== nextProps.user) {
			console.log(`user not equal ${this.props.user.username}`);
			return true;
		}
		// SCROLLING
		if (
			this.state.gravatarRendered == false &&
			this.props.isScrolling == true &&
			nextProps.isScrolling == false
		) {
			return true;
		}
		// console.log(`user not equal ${props.username}`);

		return false;
	}
	startCall = () => {
		const { user, id } = this.props;
		this.props.startCall('audio', { ...user, id });
	};
	addFriend = e => {
		// e.stopPropagation();
		const { addFriend, user } = this.props;
		addFriend(user);
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
	addUserToCall = () => {
		const { user, addToCall } = this.props;
		addToCall(user);
	};
	removeUserFromCall = () => {
		const { user, removeFromCall } = this.props;
		removeFromCall(user);
	};
	setGravatarRendered = () => {
		this.setState({ gravatarRendered: true });
	};
	render() {
		const { id, user, key, isScrolling } = this.props;
		const { username } = user;
		console.log(`rendered ${username}`);

		const { src = {}, checked, online } = user;
		const { displayName = '' } = src;

		if (!isScrolling) {
			this.setGravatarRendered();
		}
		const listItemStyle = user.checked
			? styles.listItemSelected
			: styles.listItem;
		const gravatarStyle = online ? styles.gravatarOnline : styles.gravatar;
		return (
			<Layout style={listItemStyle}>
				<Layout style={styles.listItemMain}>
					<TouchableOpacity
						onClick={checked ? this.removeUserFromCall : this.addUserToCall}
						style={styles.listItemTouchable}
					>
						<Gravatar
							style={styles.gravatarContainer}
							// online={online}
							id={id}
							imageStyles={gravatarStyle}
							// onlineBorderColor={onlineBorderColor}
							// isScrolling={isScrolling}
							isScrolling={isScrolling}
						/>
						<Layout style={styles.titleContainer}>
							<Text style={styles.listItemTitle}>{username}</Text>
							{online && <Text style={styles.listItemDetails}>online</Text>}
						</Layout>
					</TouchableOpacity>
				</Layout>
				{/* <TouchableOpacity
				// key={key}
					status={'success'}
					style={styles.button}
					onPress={this.addFriend}
				>
					<Text>Add Friend</Text>
				</TouchableOpacity> */}
				<Layout style={styles.statusBar}>
					<QuickCall
						startCall={this.startCall}
						calling={user.calling}
						connected={user.connected}
						checked={user.checked}
					></QuickCall>
				</Layout>
				<AddRemoveFriendButton
					addFriend={this.addFriend}
					removeFriend={this.removeFriend}
					isFriend={user.isFriend}
					friendStatus={user.friendStatus}
					acceptFriend={this.acceptFriend}
					rejectFriend={this.rejectFriend}
					user={username}
					// style={buttonStyleAlt}
				/>
				{/* <AddRmTest /> */}
				{/* {user.friendStatus !== 'A' && ( */}
				{/* <AddRemoveFriendButton
						onAdd={this.addFriend}
						removeFriend={this.removeFriend}
						isFriend={user.isFriend}
						friendStatus={user.friendStatus}
						acceptFriend={this.acceptFriend}
						rejectFriend={this.rejectFriend}
						// style={buttonStyleAlt}
					/> */}
				{/* )} */}
			</Layout>
		);
	}
}

const listItemStyleBase = {
	margin: 10,
	borderRadius: 12,
	boxShadow: ` 8px 8px 5px #161c30, 
	-8px -8px 5px #1e2640`,
	// LATEST boxShadow: `-23px 23px 46px #171d2f, 23px -23px 46px #2d395b`,
	backgroundColor: `linear-gradient(225deg, #242e4a, #1f273e)`,
	flexBasis: 75,
	flexGrow: 1,
	alignItems: 'stretch',
	display: 'flex',
	flexDirection: 'row',
	overflow: 'hidden',
	padding: 0,
	paddingHorizontal: 0,
	paddingVertical: 0,
	zIndex: 9
};
const styles = StyleSheet.create({
	listItem: listItemStyleBase,
	listItemSelected: {
		...listItemStyleBase,
		borderWidth: 3,
		borderColor: '#00E096'
	},
	listItemMain: {
		backgroundColor: 'inherhit',
		flexBasis: '25%',
		zIndex: 10,
		// MAY NEED TO REACTIVATE FOR FLEX POSITION
		// height: '55%',
		justifyContent: 'center',
		// alignSelf: 'center',
		display: 'flex',
		flexDirection: 'row',
		// alignContent: 'center',
		// alignItems: 'center',
		width: '100%',
		flexGrow: 1,
		flexShrink: 1
		// height: 50

		// justifyContent: 'center'
	},
	gravatarContainer: {
		flexBasis: 50,
		flex: 0,
		marginLeft: 10,
		backgroundColor: 'inherit',
		// alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'flex-end'

		// alignItems: 'flex-end'
		// borderRadius: '50%',
	},
	gravatar: {
		minWidth: 20,
		minHeight: 20,
		maxHeight: 40,
		maxWidth: 40,
		height: '100%',
		width: '100%',
		borderRadius: 100,
		backgroundColor: 'inherit'
	},
	gravatarOnline: {
		minWidth: 20,
		minHeight: 20,
		maxHeight: 40,
		maxWidth: 40,
		height: '100%',
		width: '100%',
		borderRadius: 100,
		backgroundColor: 'inherit',
		borderWidth: 2,
		borderColor: '#00E096'
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
		justifySelf: 'flex-end'
		// width: '100%'
	},
	statusBar: {
		flexBasis: '15%',
		// flexBasis: '100%',
		// alignItems: 'center',
		alignItems: 'stretch',
		textAlign: 'center',
		borderTopRightRadius: 4,
		borderTopRightRadius: 4,
		// justifySelf: 'flex-end',
		justifyContent: 'center',
		backgroundColor: 'rgba(143, 155, 179, 0.24)',
		order: 5
		// width: '100%'
	},
	listItemTitle: {
		fontSize: 13,
		fontWeight: 600,
		textAlign: 'start',
		// alignContent: 'center',
		paddingLeft: 10,
		color: '#EDF1F7'
	},
	listItemDetails: {
		fontSize: 10,
		fontWeight: 400,
		textAlign: 'start',
		alignContent: 'center',
		paddingRight: 20,
		paddingLeft: 10,
		color: '#00E096'
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
const mapStateToProps = (state, props) => {
	// const { }
	return {
		user: getUser(state, props)
	};
};
const mapDispatchToProps = dispatch => {
	return {
		startCall: (type = 'audio', user) => dispatch(Actions.startCall(type, user)),
		addToCall: user => dispatch(Actions.addToCall(user)),
		removeFromCall: user => dispatch(Actions.removeFromCall(user)),
		addFriend: user => dispatch(Actions.addFriend(user)),
		removeFriend: user => dispatch(Actions.removeFriend(user)),
		respondFriendRequest: (user, didAccept) =>
			dispatch(Actions.respondFriendRequest(user, didAccept))
		// dispatch(actionCreator)
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(UserItem);
