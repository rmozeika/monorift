import ApolloClient, { gql } from 'apollo-boost';
// or you can use `import gql from 'graphql-tag';` instead

const client = new ApolloClient({
	uri: 'https://monorift.com/graphql'
});
export async function query(query) {
	// const result = await client
	//     .query(query);
	const result = await client.query({
		query: gql`
			${query}
		`
	});
	return result;
}
export async function getFriends(id = 11392) {
	const result = await query(`
        {
            getFriendsForUser(input: { id: ${id} }) {
                id,
                friends {
                    ids,
                    users {
                        username,
                        id
                    }
                }
            }
        }
    `);
	debugger; //remove

	console.log(result);
	return result;
}
