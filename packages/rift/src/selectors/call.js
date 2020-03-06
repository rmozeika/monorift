import { createSelector } from 'reselect';
export const selectIncomingCall = state => state.call.peerStore.incomingCall;
export const incomingCallPending = state =>
	state.call.peerStore.incomingCall.pending;
