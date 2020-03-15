import React from 'react';
import { View } from 'react-native';
import { Input, withStyles } from '@ui-kitten/components';
import { connect } from 'react-redux';
import { setCode } from '../actions';
import { ThemedComponentProps, ThemeType } from '@ui-kitten/components/theme';

interface State {
	inputValue: string;
}
interface Code {
	text: string;
}
interface EditorComponentProps {
	code: Code;
}
type EditorProps = EditorComponentProps & ThemedComponentProps;
class Editor extends React.Component<EditorProps, {}> {
	private onInputValueChange = (inputValue: string) => {};
	public render(): React.ReactNode {
		const { themedStyle } = this.props;
		return (
			<View style={themedStyle.container}>
				<Input
					size="large"
					status="danger"
					value={this.props.code.text}
					onChangeText={this.onInputValueChange}
				/>
			</View>
		);
	}
}

const getCode = code => {
	return code;
};
const mapStateToProps = state => {
	return {
		code: getCode(state.code),
		visibility: state.visibility
	};
};
const EditorWithStyles = withStyles(Editor, (theme: ThemeType) => ({
	container: { backgroundColor: theme['color-basic-300'], flex: 1 }
}));
export default connect(mapStateToProps, {})(EditorWithStyles);
