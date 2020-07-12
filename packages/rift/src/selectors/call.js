import { createSelector } from 'reselect';

import { getUserById, getUser } from './users';

export const incomingConnections = state => {
	const connections = mapConnections(state);
	const incoming = connections.filter(
		({ active, incoming }) => active == false && incoming == true
	);
	const users = incoming.map(conn => {
		const user = getUserById(state, { id: conn.id });
		return { ...user, ...conn };
	});
	return users;
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
