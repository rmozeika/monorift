const GraphqlSchemaInstance = require('../Schema');

class UserSchema extends GraphqlSchemaInstance {
	repoName = 'users';
	constructor(api) {
		super(api);
		// this.api = api;
		// this.repository = api.repositories[repo];
	}
	static getRepoName() {
		return 'users';
	}

	createContext() {
		this.context = async ({ req }) => {
			const user = await this.api.repositories.auth.graphqlToken(req);
			return { user };
		};
	}
	createResolvers() {
		this.resolvers = {
			Query: {
				user: (parent, args) => {
					const { id } = args;
					return this.repository.getUserById(id);
					// return repository.findById(id);
				},
				users: (parent, args) => {
					console.log(args);
					const { input = {} } = args;
					return this.repository.getUsersPostgres(input);
				},
				allUsers: () => {
					return repository.getUsersPostgres();
				},
				getFriendsForUser: async (parent, args) => {
					console.log(args);
					const { input = {} } = args;
					const users = await this.repository.getUsersPostgres(input);
					const [user] = users;
					return user;
				},
				friends: async (parent, args) => {
					const { input } = args;
					const user = await this.api.repositories.friends.query({
						member1_id: input.id
					});
					return user;
				}
			},

			Mutation: {
				createUser: async (parent, args) => {
					const { input } = args;
					const user = await this.repository.createUser(input);
					return user;
				}
			},

			UserWithFriends: {
				friends: async (parent, args, context) => {
					const { id, admin } = context.user;
					// const { id } = parent;
					const users = await this.api.repositories.friends.query({
						member1_id: id || parent.id
					});
					return users;
				}
			},
			FriendsList: {
				ids: (parent, args) => {
					const output = [];
					parent.forEach(({ member2_id }) => output.push(member2_id));
					return output;
				},
				users: async (parent, args, context) => {
					// const { member2_id: id } = parent;
					// const user = await this.repository.getUserById(id);
					// const users = await this.repository.query({ id });
					// const [ user ] = users;
					// console.log(user);
					const ids = parent.map(({ member2_id }) => member2_id);
					const users = await this.repository.query({ id: ids });
					//  ptr
					return users;
				}
			}
		};
	}
}

module.exports = UserSchema;
