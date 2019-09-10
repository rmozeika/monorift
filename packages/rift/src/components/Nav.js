import React from "react";
import { Button } from "react-native-elements";

import { MKButton } from "react-native-material-kit"
class Nav extends React.Component {
  render() {
    return (
      <div>
        <Button title={"button"}></Button>
        <MKButton
          backgroundColor={MKColor.Teal}
          shadowRadius={2}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.7}
          shadowColor="black"
          onPress={() => {
            console.log("hi, raised button!");
          }}
        >
          <Text
            pointerEvents="none"
            style={{ color: "white", fontWeight: "bold" }}
          >
            RAISED BUTTON
          </Text>
        </MKButton>
        "Hello"
      </div>
    );
  }
}
export default Nav;
