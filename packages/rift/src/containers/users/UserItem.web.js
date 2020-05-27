import * as React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '@actions';
import { getUser } from '@selectors/users';
import AddRemoveFriendButton from '@components/buttons/AddRemoveFriend';
import Gravatar from '@components/users/Gravatar';
import QuickCall from '@components/buttons/QuickCall';

class UserItem extends React.Component {
	constructor(props) {
		super(props);
		// Only used in web (react-window)
		this.state = { gravatarRendered: false };
	}
	shouldComponentUpdate(nextProps) {
		if (this.props.user !== nextProps.user) {
			// console.log(`user not equal ${this.props.user.username}`);
			return true;
		}
		// SCROLLING
		if (
			this.state.gravatarRendered == false &&
			this.props.isScrolling == true &&
			nextProps.isScrolling == false
		) {
			this.setGravatarRendered();
			return true;
		}
		// console.log(`user not equal ${props.username}`);

		return false;
	}
	startCall = () => {
		const { user, id } = this.props;
		this.props.startCall('audio', { ...user, id });
	};
	endCall = () => {
		const { id } = this.props;
		this.props.endCall(id);
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
		const { id, user, isScrolling } = this.props;
		const { username, gravatar } = user;
		// console.log(`rendered ${username}`);

		const { src = {}, checked, online } = user;
		const { displayName = '' } = src;

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
							uri={gravatar}
							id={id}
							imageStyles={gravatarStyle}
							isScrolling={isScrolling}
						/>
						<Layout style={styles.titleContainer}>
							<Text style={styles.listItemTitle}>{username}</Text>
							{online && <Text style={styles.listItemDetails}>online</Text>}
						</Layout>
					</TouchableOpacity>
				</Layout>
				<Layout style={styles.statusBar}>
					<QuickCall
						startCall={this.startCall}
						endCall={this.endCall}
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
				/>
			</Layout>
		);
	}
}

const listItemStyleBase = {
	margin: 10,
	borderRadius: 12,
	boxShadow: `6px 6px 12px #080912, 
	-6px -6px 12px #181f3a;
	`,
	backgroundColor: `linear-gradient(225deg, #151A30, #101426)`,
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
		justifyContent: 'center',
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		flexGrow: 1,
		flexShrink: 1
	},
	gravatarContainer: {
		flexBasis: 50,
		flex: 0,
		marginLeft: 10,
		backgroundColor: 'inherit',
		justifyContent: 'center',
		alignItems: 'flex-end'
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
	titleContainer: {
		flexBasis: '50%',
		flexGrow: 1,
		backgroundColor: 'inherit',
		alignContent: 'center',
		justifyContent: 'center'
	},
	statusBar: {
		flexBasis: '15%',
		alignItems: 'stretch',
		textAlign: 'center',
		borderTopRightRadius: 12,
		borderBottomRightRadius: 12,
		justifyContent: 'center',
		borderColor: 'rgba(0, 224, 150, 0.48)',
		backgroundColor: 'rgba(44, 255, 187, 0.05)',
		borderWidth: 1,
		order: 5
	},
	listItemTitle: {
		fontSize: 13,
		fontWeight: 600,
		textAlign: 'start',
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
	listItemTouchable: {
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row'
	}
});
const mapStateToProps = (state, props) => {
	return {
		user: getUser(state, props)
	};
};
const mapDispatchToProps = dispatch => {
	return {
		startCall: (type = 'audio', user) =>
			dispatch(Actions.startCall({ type, user })),
		endCall: id => dispatch(Actions.endCall(id)),
		addToCall: user => dispatch(Actions.addToCall(user)),
		removeFromCall: user => dispatch(Actions.removeFromCall(user)),
		addFriend: user => dispatch(Actions.addFriend(user)),
		removeFriend: user => dispatch(Actions.removeFriend(user)),
		respondFriendRequest: (user, didAccept) =>
			dispatch(Actions.respondFriendRequest(user, didAccept))
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(UserItem);
