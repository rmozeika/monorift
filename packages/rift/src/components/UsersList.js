import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../actions';

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
		// padding: 16,
		// flexDirection: 'row',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	userListLayout: {
		width: '100%',
		overflowY: 'scroll',
		height: '80vh'
		// display: 'flex'
	},
	row: {
		padding: 15,
		width: '100%',
		alignItems: 'center'
		// flexDirection: 'row'
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
		// display: 'flex',
		flexShrink: 1
		// flexWrap: 'wrap'
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
		// margin: 8,
		// width: '50%',
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
		const { online, themedStyle, children } = this.props;
		const renderItemAccessory = (style, index) => {
			// const buttonStyle = {
			// 	...style,
			// 	...themedStyle.button,
			// 	...styles.button
			// 	// marginHorizontal: themedStyle.buttonGroup.marginHorizontal
			// };
			const buttonStyleAlt = [
				style,
				// themedStyle.button,
				styles.button
				// marginHorizontal: themedStyle.buttonGroup.marginHorizontal
			];
			// console.log('BUTTON_STYLE', buttonStyle);
			const { checked } = this.state;
			const createAddFunc = thisIndex => {
				function callAdd() {
					this.onAdd(thisIndex);
				}
				return callAdd.bind(this);
			};

			let taskButton;
			if (online[index].checked) {
				taskButton = (
					<Button
						onPress={() => this.onRemove(index)}
						appearance="outline"
						status="danger"
						style={buttonStyleAlt}
					>
						Remove
					</Button>
				);
			} else {
				taskButton = (
					<Button
						status="success"
						appearance="outline"
						onPress={() => this.onAdd(index)}
						style={buttonStyleAlt}
					>
						Add
					</Button>
				);
			}
			debugger;
			return (
				<Layout style={[themedStyle.pseudoButtonGroup, styles.pseudoButtonGroup]}>
					<Button
						appearance="outline"
						status="primary"
						onPress={() => {
							this.onPressedCall(index, 'audio').bind(this);
						}}
						style={buttonStyleAlt}
					>
						Call
					</Button>
					{taskButton}
				</Layout>
				// </ButtonGroup>

				// </Layout>
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
		const renderItem = ({ item: user, index }) => {
			console.log(user);
			const { name } = user;
			return (
				<ListItem
					title={`${name}`}
					description={`${'Call'} ${index + 1}`}
					icon={renderItemIcon}
					accessory={renderItemAccessory}
				/>
			);
		};

		return (
			<Layout style={styles.userListLayout}>
				<List
					data={online}
					renderItem={renderItem}
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
		setViewTab: tab => dispatch(Actions.setTabView(tab))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { view } = state;
	const { tab } = view;
	return {
		tab: tab
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UsersListWithStyles);
