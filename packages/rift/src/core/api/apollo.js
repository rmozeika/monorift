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
const GET_FRIENDS = gql`
	{
		friends {
			ids
			users {
				username
			}
		}
	}
`;
const CREATE_GUEST = gql`
	mutation($username: String!, $password: String!) {
		createGuest(input: { username: $username, password: $password }) {
			user {
				id
				oauth_id
				username
				online
				gravatar
			}
			success
			error
		}
	}
`;

const GET_USER_BY_ID1 = gql`
	{
		userById(id: $id) {
			username
			gravatar
			id
			oauth_id
		}
	}
`;

const GET_USER_BY_ID = gql`
	query($id: Int!) {
		userById(id: $id) {
			username
			id
		}
	}
`;
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
export async function getFriends() {
	try {
		const res = await client.query({
			query: GET_FRIENDS
		});
		console.log(res);
		return res;
	} catch (e) {
		console.error(e);
	}
	// const result = await query(`
	//     {
	//         getFriendsForUser() {
	//             id,
	//             friends {
	//                 ids,
	//                 users {
	//                     username,
	//                     id
	//                 }
	//             }
	//         }
	//     }
	// `);

	// console.log(result);
}
// most likely not going to be used
export async function getFriendsForId(id = 11392) {
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

	console.log(result);
	return result;
}

export async function createGuest(username, password) {
	try {
		const res = await client.mutate({
			mutation: CREATE_GUEST,
			variables: {
				//  input: {
				username,
				password
				//   }
			}
		});
		return res.data.createGuest;
	} catch (e) {
		console.error(e);
		debugger; // error
	}
}

export async function getUserById(id = 9391) {
	try {
		const res = await client.query({
			query: GET_USER_BY_ID,
			variables: { id }
		});
		console.log(res);
		return res;
	} catch (e) {
		console.error(e);
		return e;
	}
}
