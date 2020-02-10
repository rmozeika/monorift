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
} from 'react-native-ui-kitten';
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
		display: 'flex'
		// flexWrap: 'wrap'
	},
	column: {
		padding: 15,
		height: 'auto',
		width: 'auto',
		flexBasis: 'auto',
		flexShrink: 1,
		flexGrow: 1
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
	onAdd(index, val) {
		const { addToCall } = this.props;
		addToCall(index);
	}
	onRemove(index, val) {
		const { removeFromCall } = this.props;
		removeFromCall(index);
	}
	render() {
		const { online, themedStyle } = this.props;
		const renderItemAccessory = (style, index) => {
			const buttonStyle = {
				...style,
				...themedStyle.button
				// marginHorizontal: themedStyle.buttonGroup.marginHorizontal
			};
			console.log('BUTTON_STYLE', buttonStyle);
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
						style={buttonStyle}
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
						style={buttonStyle}
					>
						Add
					</Button>
				);
			}
			return (
				// <Layout styles={ { flexDirection: 'row' } }>
				// <Toggle
				// 	checked={checked}
				// 	style={{ marginLeft: 8 }}
				// 	// onChange={() => { if (truethis.setState({ checked: true })}
				// />
				// <ButtonGroup themedStyle={{ color: 'red' }} appearance="outline" status="primary">
				<Layout style={themedStyle.psuedoBtnGroup}>
					<Button
						appearance="outline"
						status="primary"
						onPress={() => {
							this.onPressedCall(index, 'audio').bind(this);
						}}
						style={buttonStyle}
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

		// const onlineUserList = online.map(user => {
		// 	return (
		// 		<Layout style={styles.userBlock}>
		// 			<Layout style={styles.column}>
		// 				<Button>Test</Button>
		// 			</Layout>
		// 			<Layout style={styles.column}>
		// 				<Text>{user}</Text>
		// 			</Layout>
		// 			<Layout style={styles.column}>
		// 				<Button>Test</Button>
		// 			</Layout>
		// 		</Layout>
		// 	);
		// });
		return (
			<List data={online} renderItem={renderItem} style={{ width: '100%' }} />
		);

		// return (
		// 	<Layout style={styles.container}>
		// 		{/* <Layout style={styles.row}> */}
		// 		{onlineUserList}
		// 		{/* </Layout> */}
		// 	</Layout>
		// );
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
	button: { flexGrow: 0, width: '20vw' },
	psuedoBtnGroup: {
		display: 'flex',
		flexDirection: 'row'
	}
}));
export default UsersListWithStyles;