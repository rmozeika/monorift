import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { client } from '../apollo';
console.log(client);

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
			id
			oauth_id
			username
			online
			gravatar
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
		const user = parseUser(res);
		return user;
	} catch (e) {
		console.error(e);
		return e;
	}
}

export function parseUser(raw) {
	return raw.data.userById;
}
