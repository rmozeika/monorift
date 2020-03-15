import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Icon } from '@ui-kitten/components';

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

	const addIcon = () => {
		return (
			<Icon
				// {...style2}
				// style={{ color: themedStyle.icons.color }}
				name="circle"
				solid
				color={'rgb(0, 224, 150)'}
			/>
		);
	};
	if (true == true) {
		return null;
	}
	return (
		<TouchableOpacity
			style={{ position: 'absolute', height: '100%', width: '100%' }}
		></TouchableOpacity>
	);
	// return (
	// 	<Button icon={addIcon} appearance="ghost" style={[style, otherStyles]} {...restProps} />
	// )
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
