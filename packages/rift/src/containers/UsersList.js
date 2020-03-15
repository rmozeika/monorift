import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
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
} from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import * as CallSelectors from '../selectors/call';
import * as UserSelectors from '../selectors/users';
import UserItem from './UserItem';

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
	// REMOVE
	buttonBottom: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	// REMOVE
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
		order: -1,
		justifyContent: 'space-between'
	},
	// REMOVe
	listItem: {
		margin: 2,
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
		flexBasis: 150,
		flexGrow: 1,
		flexShrink: 1,
		marginVertical: 4
	}
});
class UsersList extends React.PureComponent {
	constructor(props) {
		super();
		this.renderItem = this.renderItem.bind(this);
	}
	goTalk() {
		console.log('UsersList');
		this.props.setTabView(2);
	}
	onRemove(index) {
		const { removeFromCall } = this.props;
		const user = this.getUserFromIndex(index);
		removeFromCall(index, user);
	}
	// REMOVE
	addFriend(index) {
		const { addFriend } = this.props;
		const user = this.getUserFromIndex(index);
		addFriend(user);
	}
	// REMOVE

	removeFriend(index) {
		const { removeFriend } = this.props;
		const user = this.getUserFromIndex(index);
		removeFriend(user);
	}
	// REMOVE

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
		return (
			<UserItem
				themedStyle={this.props.themedStyle.userItem}
				username={user}
				index={index}
				{...restProps}
			/>
		);
	}
	// // REMOVE
	// renderItemAccessory(style, index) {
	// 	const buttonStyleAlt = [style, styles.button];
	// 	const { checked } = this.state;
	// 	const renderButtons = [];
	// 	const user = this.getUserFromIndex(index);
	// 	if (user.isFriend || !user.isFriend) {
	// 		renderButtons.push(
	// 			<AddToCallButton
	// 				checked={user.checked}
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
	// }
	// // REMOVE
	// renderItemIcon(style, index) {
	// 	const { themedStyle } = this.props;
	// 	console.log(style, index);
	// 	const user = this.getUserFromIndex(index);

	// 	const style2 = {
	// 		width: 5, //style.width, // CHANGE THIS
	// 		height: 5, //style.height, // CHANGE
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
	// }
	render() {
		const { themedStyle, baseHeight, incomingCallPending, users } = this.props;

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
	statusBar: {
		backgroundcolor: theme['color-basic-transparent-disabled-border']
	},
	// statusText: {
	// 	color: theme['color-success-500'] // CHANGE THIS!
	// },
	// iconOnline: {
	// 	backgroundColor: theme['color-primary-100'],
	// 	// color: theme['color-basic-800']
	// 	color: theme['color-success-500']
	// },
	userItem: {
		onlineColor: theme['color-success-500'],
		statusBar: {
			backgroundcolor: theme['color-basic-transparent-disabled-border']
		},
		statusText: {
			color: theme['color-success-500'] // CHANGE THIS!
		},
		iconOnline: {
			backgroundColor: theme['color-primary-100'],
			// color: theme['color-basic-800']
			color: theme['color-success-500']
		}
		// REMOVE
		// iconOffline: {
		// 	backgroundColor: theme['color-primary-100'],
		// 	// color: theme['color-basic-800']
		// 	color: theme['color-success-500'] // CHANGE THIS!
		// },
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
		setTabView: tab => dispatch(Actions.setTabView(tab))
	};
};
const mapStateToProps = state => {
	const { view } = state;
	const { tab, mobile } = view;
	const visibleUsers = UserSelectors.getVisibleUsers(state) || [];
	return {
		tab,
		mobile,
		incomingCallPending: CallSelectors.incomingCallPending(state),
		users: visibleUsers
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
