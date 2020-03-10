import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, List } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { getUser } from '../selectors/users';

const styles = StyleSheet.create({
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
	}
});
class UserItem extends React.PureComponent {
	constructor(props) {
		super(props);
		this.addUserToCall = this.addUserToCall.bind(this);
	}
	addUserToCall(index) {
		const { user, addToCall } = this.props;
		addToCall(index, user);
	}
	render() {
		// debugger; //remove
		const { username, index, themedStyle, user } = this.props;
		// return (<ListItem title={item.username} />);
		// renderItem({ item: user, index }) {
		console.log(username);
		// const { themedStyle, onAdd } = this.props;
		console.log('render item', username);
		const { src = {} } = user;
		const { displayName = '' } = src;
		const iconColor = themedStyle['iconOnline'].color;
		const border = {};
		// const border = user.checked ? { borderWidth: 2, borderColor: iconColor } : {};
		// debugger; //
		return (
			// <TouchableOpacity onPress={this.onAdd}>

			<ListItem
				title={username}
				// title={`${username}`}
				description={`${displayName}`}
				// icon={renderItemIcon}
				key={index}
				// accessory={renderItemAccessory}
				style={[styles.listItem, border]}
				onClick={() => this.addUserToCall(index)}
			/>
			// </TouchableOpacity>
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
		addToCall: (index, user) => dispatch(Actions.addToCall(index, user))
		// dispatch(actionCreator)
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(UserItem);
