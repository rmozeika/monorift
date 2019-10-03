import * as React from "react";
import { Layout, Text, Button, styled } from "react-native-ui-kitten";
import { connect } from "react-redux";
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // flexDirection: 'row',
    alignItems: 'center'
  },
  row: {
     // flex: 1
    // backgroundColor: 'red',
     padding: 15
  },
  bigBlue: {
    //backgroundColor: 'blue',
    flexGrow: 5
  }

});
export const HomeScreen = () => {
  return (
    <Layout style={styles.container}>
        <Layout style={styles.row}>
          <Text category="h4">Welcome to UI Kitten</Text>
        </Layout>
        <Layout style={[styles.row, styles.bigBlue]}>
          <Button>BUTTON</Button>
        </Layout>
        <Layout style={styles.row}>
          <Button>BUTTON</Button>
        </Layout>
      </Layout>
  );
};

export default connect(state => state)(HomeScreen);
