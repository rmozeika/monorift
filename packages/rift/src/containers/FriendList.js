import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import * as CallSelectors from '../selectors/call';
import AddToCallButton from '../components/buttons/AddToCall';

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
		overflowY: 'scroll',
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
	}
	setChecked(index, vale) {}
	onPressedCall(index, type) {
		console.log('clicked!');
	}
	goTalk() {
		console.log('UsersList');
		this.props.setViewTab(1);
	}
	onAdd(index, val) {
		const { addToCall } = this.props;
		addToCall(index);
	}
	onRemove(index, val) {
		const { removeFromCall } = this.props;
		removeFromCall(index);
	}
	render() {
		const {
			online,
			themedStyle,
			baseHeight,
			incomingCallPending,
			friends
		} = this.props;

		const renderItemAccessory = (style, index) => {
			const buttonStyleAlt = [style, styles.button];
			const { checked } = this.state;

			return (
				<Layout style={[themedStyle.pseudoButtonGroup, styles.pseudoButtonGroup]}>
					<AddToCallButton
						checked={online[index].checked}
						onAdd={this.onAdd}
						onRemove={this.onRemove}
						otherStyles={style}
					/>
				</Layout>
			);
		};

		const renderItemIcon = style => {
			console.log(style);
			const style2 = {
				width: style.width,
				height: style.height,
				marginHorizontal: style.marginHorizontal,
				color: 'black'
			};
			return (
				<Icon
					{...style2}
					style={{ color: themedStyle.icons.color }}
					name="user"
					solid
					fill="#3366FF"
				/>
			);
		};

		const renderFriend = ({ item: user, index }) => {
			console.log(user);
			const { username } = user;
			return (
				<ListItem
					title={`${username}`}
					description={`${'Call'}`}
					icon={renderItemIcon}
					accessory={renderItemAccessory}
				/>
			);
		};
		const { mobile } = this.props;
		const heightMultiplier = incomingCallPending ? 0.8 : 0.9;
		const derivedHeight = baseHeight * heightMultiplier;
		return (
			<Layout style={[styles.userListLayout, { height: derivedHeight }]}>
				<List
					data={friends}
					renderItem={renderFriend}
					style={{ width: '100%', flexShrink: 1 }}
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
	icons: {
		backgroundColor: theme['color-primary-100'],
		color: theme['color-basic-800']
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
		setViewTab: tab => dispatch(Actions.setTabView(tab)),
		addToCall: index => dispatch(Actions.addToCall(index)),
		removeFromCall: index => dispatch(Actions.removeFromCall(index))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { view, peerStore, users } = state;
	const { tab, mobile } = view;
	return {
		tab,
		mobile,
		incomingCallPending: CallSelectors.incomingCallPending(state),
		friends: users.friends
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListWithStyles);
