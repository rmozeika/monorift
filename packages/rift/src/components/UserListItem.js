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
	Toggle,
	theme,
	useTheme
} from 'react-native-ui-kitten';
import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as Actions from '../actions';

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
				Add Friend
			</Button>
		);
	}
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

const UserListItem = ({ item: user, index }) => {
	// const { themedStyle } = this.props;
	const theme = useTheme();
	const iconColor = theme['color-basic-800'];
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
				style={{ color: iconColor }}
				name="user"
				solid
				fill="#3366FF"
			/>
		);
	};
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

export default UserListItem;

function CallAdderHOC(WrappedComponent) {
	class CallAdd extends React.Component {
		componentWillReceiveProps(nextProps) {
			console.log('Current props: ', this.props);
			console.log('Next props: ', nextProps);
		}
		render() {
			const { add, ...props } = this.props;
			// Wraps the input component in a container, without mutating it. Good!
			return <WrappedComponent {...props} />;
		}
	}
	const mapDispatchToProps = (dispatch, ownProps) => {
		return {
			setTabView: tab => dispatch(Actions.setTabView(tab)),
			addToCall: index => dispatch(Actions.addToCall(index)),
			removeFromCall: index => dispatch(Actions.removeFromCall(index))
		};
	};
	const mapStateToProps = (state, ownProps) => {
		const { view, peerStore } = state;
		const { tab, mobile } = view;
		return {
			tab,
			mobile,
			incomingCallPending: CallSelectors.incomingCallPending(state)
		};
	};
	const connectedHOC = connect(mapStateToProps, mapDispatchToProps)(CallAdd);
}
