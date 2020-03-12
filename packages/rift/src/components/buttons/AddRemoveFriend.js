import * as React from 'react';
import { Button, Icon } from 'react-native-ui-kitten';
import { StyleSheet } from 'react-native';
const AddFriendIcon = style => <Icon name="friend" />;
const styles = StyleSheet.create({
	button: {
		flex: 1,
		margin: 0,
		marginRight: 0,
		minWidth: 10,
		height: '100%'
	}
});
export default ({ isFriend, onRemove, onAdd, style }) => {
	const buttonProps = {
		remove: {
			onPress: onRemove,
			status: 'danger',
			text: 'Remove from Call'
		},
		add: {
			onPress: onAdd,
			status: 'success',
			text: 'Add To Call'
		}
	};
	const { text, ...restProps } = isFriend
		? buttonProps['remove']
		: buttonProps['add'];
	return (
		<Button
			style={[style, styles.button]}
			status="success"
			icon={AddFriendIcon}
		></Button>
	);
	return (
		<Button appearance="outline" style={buttonStyleAlt} {...restProps}>
			{text}
		</Button>
	);
};
// if (online[index].checked) {
//     taskButton = (
//         <Button
//             onPress={() => this.onRemove(index)}
//             appearance="outline"
//             status="danger"
//             style={buttonStyleAlt}
//         >
//             Remove
//         </Button>
//     );
// } else {
//     taskButton = (
//         <Button
//             status="success"
//             appearance="outline"
//             onPress={() => this.onAdd(index)}
//             style={buttonStyleAlt}
//         >
//             Add To Call
//         </Button>
//     );
// }
