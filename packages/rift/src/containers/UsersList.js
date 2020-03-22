import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { Layout, List, withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Selectors from '../selectors';
import * as CallSelectors from '../selectors/call';
import * as UserSelectors from '../selectors/users';
import * as AuthSelectors from '../selectors/auth';

import UserItem from './UserItem';
import YourProfile from './YourProfile';
import SearchBar from '../components/SearchBar';

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
		this.props.setTabView(2);
	}
	calculateHeights() {
		const { mobile, baseHeight, incomingCallPending } = this.props;
		const extraSpace = incomingCallPending ? 0.1 : 0;
		const baseHeightMultiplier = mobile ? 0.9 : 1;
		const heightMultiplier = baseHeightMultiplier - extraSpace;
		return baseHeight * heightMultiplier;
	}
	renderItem({ item: user, index, ...restProps }) {
		// IF REACTIVATE PROFILE
		// if (user == 'self') {
		// 	return (<YourProfile themedStyle={this.props.themedStyle.userItem} />);
		// }
		return (
			<UserItem
				themedStyle={this.props.themedStyle.userItem}
				username={user}
				index={index}
				{...restProps}
			/>
		);
	}

	render() {
		const { themedStyle, baseHeight, incomingCallPending, users } = this.props;

		const derivedHeight = this.calculateHeights();
		// IF REACTIVATE PROFILE

		// if (self !== null) {
		// 	users.unshift('self');
		// }

		return (
			<Layout style={[styles.userListLayout, { height: '100%' }]}>
				<SearchBar />
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
					initialNumToRender={8}
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
	},

	container: { backgroundColor: '#1A2138' }
}));

const mapDispatchToProps = dispatch => {
	return {
		setTabView: tab => dispatch(Actions.setTabView(tab))
	};
};
// const makeMapStateToProps = () => {

// 	const getVisibleUsers = UserSelectors.makeGetVisibleUsersFiltered();
// 	const mapStateToProps = (state, props) => {
// 		const { view } = state;
// 		const { tab, mobile } = view;
// 		return {
// 			tab,
// 			mobile,
// 			incomingCallPending: CallSelectors.incomingCallPending(state),
// 			users: getVisibleUsers(state, props)
// 			// IF REACTIVATE PROFILE
// 			// self: AuthSelectors.getSelfUser(state)
// 		};
// 	return mapStateToProps
//   }
// };
const mapStateToProps = (state, props) => {
	const { view } = state;
	const { tab, mobile } = view;
	const visibleUsers = UserSelectors.getVisibleUserlist(state, props);
	return {
		tab,
		mobile,
		incomingCallPending: CallSelectors.incomingCallPending(state),
		users: visibleUsers
		// IF REACTIVATE PROFILE
		// self: AuthSelectors.getSelfUser(state)
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListWithStyles);
