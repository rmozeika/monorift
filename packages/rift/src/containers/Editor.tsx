import React from "react";
import { Input } from 'react-native-ui-kitten';
import { connect } from "react-redux";
import { setCode } from '../actions';

interface State {
   inputValue: string
}
interface Code {
    code: string,
    name: string
}
  // ThemeService.select({'Eva Light': null}, "Eva Light")
class Editor extends React.Component<{ code: Code }, {}> {
    private onInputValueChange = (inputValue: string) => {
        // this.setState({ inputValue });
    };
    public render(): React.ReactNode {
        return (
          <Input
            size='large'
            status='danger'
            value={this.props.code.code}
            onChangeText={this.onInputValueChange}
          />
        );
    }
}

const getCode = (code) => {
    return code;
}
const mapStateToProps = state => {
    return {
      code: getCode(state.code)
    }
}

// const mapDispatchToProps = (dispatch, ownProps) => {
//     return {
//       initCode: ({ name, code }) => {
//         dispatch(setCode({ name, code}));
//       }
//     };
//   };
export default connect(mapStateToProps, {})(Editor);
