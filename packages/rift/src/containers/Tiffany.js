import React, { Component } from 'react'
import { Layout, Text, Button, styled } from 'react-native-ui-kitten';
import { connect } from 'react-redux';
import { StyleSheet, Linking, Platform } from 'react-native';
 class Tiffany extends React.Component {
     constructor(props) {
         super(props);
     }
    render() {
        return (
            <Layout>
                HI!
            </Layout>
        );
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		sendCandidate: candidate => dispatch(Actions.sendCandidate(candidate)),
		createPeerConn: config => dispatch(Actions.createPeerConn(config)),
		sendOffer: message => dispatch(Actions.sendOffer(message)),
		setConstraints: ({ mediaStream }) =>
			dispatch(Actions.setConstraints({ mediaStream }))
	};
};
const mapStateToProps = (state, ownProps) => {
	const { call } = state;
	const { peerConn, constraints } = call;
	const { created, handlersAttached, conn } = peerConn;
	return {
		peerConn: conn,
		peerConnStatus: { created, handlersAttached },
		mediaStreamConstraints: constraints.mediaStream
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Tiffany);