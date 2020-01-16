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
	withStyles
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
	}
	render() {
		const { online, themedStyle } = this.props;
		const renderItemAccessory = style => (
			<ButtonGroup>
				<Button style={style}>Call</Button>
				<Button style={style}>Video</Button>
			</ButtonGroup>
		);

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
					title={`${name} ${index + 1}`}
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
		return <List data={online} renderItem={renderItem} />;

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
	action: { marginHorizontal: 4 }
}));
export default UsersListWithStyles;
