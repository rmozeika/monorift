import { createSelector } from 'reselect';

import { getUserById, getUser } from './users';
// export const incoming = state => {
	
// }
export const incomingConnections = state => {
	const connections = mapConnections(state);
	const incoming = connections.filter(
		({ active, incoming }) => active == false && incoming == true
	);
	const users = incoming.map(conn => {
		const user = getUserById(state, { id: conn.id });
		return { ...user, ...conn };
	});
	const calls = incoming.reduce((acc, { call_id }) => {
		acc[call_id] = connectionsByCallId(state, { call_id, onlyNeedsOffer: false });
		return acc;
	}, {});
	return calls;
};
export const incomingConnectionsList = (state) => {
	const callsById = incomingConnections(state);
	const connectionsList = Object.keys(callsById).map(key => {
		const users = Object.entries(callsById[key]).map(([id, user]) => ({ id, ...user }));
		return { call_id: key, users };
	});
	return connectionsList;
};
export const mapConnections = state => {
	const { connections } = state.call;
	return Object.keys(connections).map(id => {
		return connections[id];
	});
};
export const activeConnections = state => state.call.connections;
export const activeConnectionsList = state => {
	// const { connections } = state.call;
	// const active = Object.keys(connections)
	const connections = mapConnections(state);

	const active = connections.filter(conn => {
		return conn.active == true;
	});
	return active;
};

export const connectionById = (state, user) => {
	const id = (typeof user == 'string') ? user : user.id;
	return state.call.connections[id];
};
export const connectionsByCallId = (state, { call_id, onlyNeedsOffer = false }) => {
	let connections = {};
	Object.keys(state.call.connections).forEach(id => {
		const connection = state.call.connections[id];
		if (connection.call_id !== call_id) return;
		if (onlyNeedsOffer && connection.offer_sent) return;
		connections[id] = connection;
	});
	return connections;
};

export const callById = (state, { call_id }) => {
	return state.call.calls[call_id];
};
