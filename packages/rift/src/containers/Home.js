import * as React from 'react';
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking } from 'react-native';
import { useAuth0 } from './auth0';

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
          {!isAuthenticated && (
            <button
              onClick={() =>
                Linking.openURL(window.location.origin + '/auth/login').catch((err) => console.error('An error occurred', err))
                //loginWithRedirect({})
              }
            >
              Log in
            </button>
          )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
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
