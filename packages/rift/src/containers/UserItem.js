import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { ListItem, Icon, Layout, Text } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { getUser } from '../selectors/users';
import AddToCallButton from '../components/buttons/AddToCall';
import AddRemoveFriendButton from '../components/buttons/AddRemoveFriend';

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
		flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'row',
		overflow: 'hidden',
		// flexShrink: 1
		// shadowColor: '#000',
		// shadowOffset: { width: 0, height: 1 },
		// shadowOpacity: 0.8,
		// shadowRadius: 1,
		padding: 0,
		paddingHorizontal: 0,
		paddingVertical: 0,
		zIndex: 9
		// marginHorizontal: 0,
		// marginVertical:0
	},
	listItemMain: {
		backgroundColor: 'inherhit',
		flexBasis: '100%',
		zIndex: 10,
		height: '55%',
		justifyContent: 'center',
		alignSelf: 'flex-end',
		display: 'flex',
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center'
	},
	gravatarContainer: {
		flexBasis: '40%',
		backgroundColor: 'inherit',
		// alignContent: 'center',
		justifyContent: 'center',
		alignItems: 'flex-end'
	},
	titleContainer: {
		flexBasis: '50%',
		flexGrow: 1,
		backgroundColor: 'inherit',
		alignContent: 'center',
		justifyContent: 'center'
	},

	listItemTitle: {
		fontSize: 13,
		fontWeight: 600,
		textAlign: 'start',
		alignContent: 'center',
		paddingLeft: 10
	},
	statusBar: {
		height: '15%',
		flexBasis: '100%',
		textAlign: 'center',
		borderTopRightRadius: 100,
		borderTopRightRadius: 100,
		alignSelf: 'flex-end'
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

	buttonContainer: {
		// position: 'absolute',
		// right: '0px
		// left: '70%',
		// right: '-5%',
		// top: '0%',
		height: '30%',
		// width: '25%'
		flexBasis: '100%',
		alignSelf: 'flex-end'
	},
	pseudoButtonGroup: {
		maxWidth: '50%',
		display: 'flex'
	},
	listItemContent: {
		backgroundColor: 'inherhit',
		position: 'relative',
		margin: 0,
		padding: 0,
		zIndex: 15,
		height: '50%'
	}
});
class UserItem extends React.PureComponent {
	constructor(props) {
		super(props);
		this.addUserToCall = this.addUserToCall.bind(this);
		this.removeUserFromCall = this.removeUserFromCall.bind(this);
		this.renderItemAccessory = this.renderItemAccessory.bind(this);
		this.renderItemIcon = this.renderItemIcon.bind(this);
		this.addFriend = this.addFriend.bind(this);
		this.removeFriend = this.removeFriend.bind(this);
	}
	addFriend() {
		const { addFriend, user } = this.props;
		addFriend(user);
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
	renderItemAccessory(style, index) {
		const { user, themedStyle } = this.props;
		const buttonStyleAlt = [style, styles.button];
		const renderButtons = [];
		const { isFriend } = user;
		// if (!user.isFriend) {
		return (
			<AddRemoveFriendButton
				onAdd={this.addFriend}
				removeFriend={this.removeFriend}
				isFriend={isFriend}
				style={buttonStyleAlt}
			/>
		);
		// }
		if (false == false) {
			return <Layout></Layout>;
		}
		// if (user.isFriend || !user.isFriend) {
		// 	renderButtons.push(
		// 		<AddToCallButton
		// 			checked={user.checked}
		// 			onAdd={this.onAdd}
		// 			onRemove={this.onRemove}
		// 			otherStyles={style}
		// 			key={`callbutton${index}`}
		// 			index={index}
		// 		/>
		// 	);
		// }
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
		const { themedStyle, user } = this.props;
		console.log(style, index);

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
				style={style} // CHANGE THIS
				{...style2}
				// style={{ color: themedStyle.icons.color }}
				name="circle"
				solid
				size={200}
				color={iconColor}
			/>
		);
	}
	render() {
		const { username, index, themedStyle, user } = this.props;
		console.log(username);
		console.log('render item', username);
		const { src = {}, checked } = user;
		const { displayName = '' } = src;
		const iconColor = themedStyle['iconOnline'].color;
		const border = user.checked ? { borderWidth: 3, borderColor: iconColor } : {};
		const otherProps = {};
		if (!user.isFriend) {
			otherProps['accessory'] = this.renderItemAccessory;
		}
		const listHeader = () => (
			<Layout>
				<Text>Header</Text>
			</Layout>
		);
		const renderAlt = true;
		if (renderAlt) {
			return (
				<ListItem
					// title={username}
					// title={`${username}`}
					// description={`${displayName}`}
					// icon={this.renderItemIcon}
					key={index}
					// { ...otherProps }
					// accessory={this.renderItemAccessory}
					style={[styles.listItem, border, { padding: 0 }]}
					onClick={checked ? this.removeUserFromCall : this.addUserToCall}
				>
					{/* <Layout style={styles.listItemContent}> */}

					<Layout style={styles.listItemMain}>
						<Layout style={styles.gravatarContainer}>
							<Image
								style={{
									minWidth: 20,
									minHeight: 20,
									maxHeight: 40,
									maxWidth: 40,
									height: '100%',
									width: '100%'
								}}
								source={{ uri: '/gravatar/robertmozeika.png' }}
							/>
						</Layout>
						<Layout style={styles.titleContainer}>
							<Text style={styles.listItemTitle}>{username}</Text>
						</Layout>
					</Layout>
					{(user.online || true) && (
						<Layout style={[styles.statusBar, themedStyle.statusBar]}>
							<Text style={themedStyle.statusText}>online</Text>
						</Layout>
					)}
					{/* {user.online && (
						<Layout style={styles.activityContainer}>
							<Icon
								style={{}} // CHANGE THIS
								// {...style2}
								// style={{ color: themedStyle.icons.color }}
								name="activity"
								solid
								size={20}
								color={'#8CFAC7'}
							/>
						</Layout>
					)} */}
					{/* {user.online && (
						<Layout style={styles.iconContainer}>
							{this.renderItemIcon(styles.icon)}
						</Layout>
					)} */}
					<Layout style={styles.buttonContainer}>
						<AddRemoveFriendButton
							onAdd={this.addFriend}
							removeFriend={this.removeFriend}
							isFriend={user.isFriend}
							// style={buttonStyleAlt}
						/>
					</Layout>
					{/* </Layout> */}
				</ListItem>
			);
		}
		return (
			<ListItem
				title={username}
				title={`${username}`}
				description={`${displayName}`}
				icon={this.renderItemIcon}
				key={index}
				// { ...otherProps }
				accessory={this.renderItemAccessory}
				style={[styles.listItem, border]}
				onClick={checked ? this.removeUserFromCall : this.addUserToCall}
			/>
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
		removeFriend: user => dispatch(Actions.removeFriend(user))
		// dispatch(actionCreator)
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(UserItem);
