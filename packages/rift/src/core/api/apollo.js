// import ApolloClient, { gql } from 'apollo-clienr';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

// or you can use `import gql from 'graphql-tag';` instead

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: 'https://monorift.com/graphql'
	})
});
export default client;
