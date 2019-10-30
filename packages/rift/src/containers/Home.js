import * as React from 'react';
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';

// const origin = (Platform.OS == 'web') ? window.location.origin : 'https://robertmozeika.com';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // flexDirection: 'row',
    alignItems: 'center'
  },
  row: {
     // flex: 1
    backgroundColor: 'red',
     padding: 15
  },
  bigBlue: {
    //backgroundColor: 'blue',
    flexGrow: 5
  }

});
export const HomeScreen = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <Layout style={styles.container}>
        <Layout style={styles.row}>
          
        </Layout>
        {/* <Layout style={[styles.row, styles.bigBlue]}>
          <Button>BUTTON</Button>
        </Layout>
        <Layout style={styles.row}>
          <Button>BUTTON</Button>
        </Layout> */}
      </Layout>
  );
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    
  };
};
export default connect(state => state, mapDispatchToProps)(HomeScreen);
