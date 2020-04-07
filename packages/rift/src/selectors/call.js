import { createSelector } from 'reselect';
export const incomingCall = state => state.call.peerStore.incomingCall;
export const incomingCallPending = state =>
	state.call.peerStore.incomingCall.pending;
