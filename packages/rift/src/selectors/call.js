import { createSelector } from 'reselect';
export const incomingCall = state => state.call.peerStore.incomingCall;
export const incomingCallPending = state =>
	state.call.peerStore.incomingCall.pending;

export const mapConnections = state => {
	const { connections } = state.call;
	return Object.keys(connections).map(id => {
		return connections[id];
	});
};
export const activeConnections = state => {
	// const { connections } = state.call;
	// const active = Object.keys(connections)
	const connections = mapConnections(state);

	const active = connections.filter(conn => {
		return conn.active == true;
	});
	return active;
};
