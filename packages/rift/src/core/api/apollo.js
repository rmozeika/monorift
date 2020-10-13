// import ApolloClient, { gql } from 'apollo-clienr';
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
// or you can use `import gql from 'graphql-tag';` instead
// import { WebSocketLink } from '@apollo/link-ws';
import { WebSocketLink } from '@apollo/client/link/ws';

const wsLink = new WebSocketLink({
	uri: `wss://monorift.com/graphql`,
	options: {
		reconnect: true
	}
});
const httpLink = new HttpLink({
	uri: 'https://monorift.com/graphql'
});
const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink
);
const createdClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: splitLink
});

export const client = createdClient;

export default client;
