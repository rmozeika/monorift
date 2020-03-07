import * as React from 'react';
import { Button } from 'react-native-ui-kitten';

export default ({ isFriend, onRemove, onAdd }) => {
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
	const { text, ...restProps } = checked
		? buttonProps['remove']
		: buttonProps['add'];
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
