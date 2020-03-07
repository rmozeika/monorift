import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-kitten';

const style = StyleSheet.create({
	flex: 1
});
export default ({ index, checked, onRemove, onAdd, otherStyles }) => {
	const buttonProps = {
		remove: {
			onPress: onRemove,
			status: 'danger',
			text: 'Remove from Call'
		},
		add: {
			onPress: () => onAdd(index),
			status: 'success',
			text: 'Add To Call'
		}
	};
	const { text, ...restProps } = checked
		? buttonProps['remove']
		: buttonProps['add'];
	return (
		<Button appearance="outline" style={[style, otherStyles]} {...restProps}>
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
