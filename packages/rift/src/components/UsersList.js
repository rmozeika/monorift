import * as React from 'react';
import { StyleSheet, Linking, Platform } from 'react-native';

import {
	Layout,
	Text,
	Button,
	styled,
	Icon,
	List,
	ListItem
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
		const { online } = this.props;
		const renderItemAccessory = style => <Button style={style}>FOLLOW</Button>;

		const renderItemIcon = style => <Icon {...style} name="person" />;
		const renderItem = ({ item, index }) => (
			<ListItem
				title={`${item.title} ${index + 1}`}
				description={`${item.description} ${index + 1}`}
				icon={renderItemIcon}
				accessory={renderItemAccessory}
			/>
		);
		const onlineUserList = online.map(user => {
			return (
				<Layout style={styles.userBlock}>
					<Layout style={styles.column}>
						<Button>Test</Button>
					</Layout>
					<Layout style={styles.column}>
						<Text>{user}</Text>
					</Layout>
					<Layout style={styles.column}>
						<Button>Test</Button>
					</Layout>
				</Layout>
			);
		});
		return (
			<Layout style={styles.container}>
				{/* <Layout style={styles.row}> */}
				{onlineUserList}
				{/* </Layout> */}
			</Layout>
		);
	}
}
export default UsersList;
