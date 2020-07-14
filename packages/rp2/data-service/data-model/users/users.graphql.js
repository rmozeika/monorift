const GraphqlSchemaInstance = require('../GraphqlSchema');
const { update } = require('lodash');

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
	setExtraRepos() {
		this.members = this.api.repositories.members;
		this.auth = this.api.repositories.auth;
	}
	createContext() {
		this.context = async ({ req, res }) => {
			const user = await this.api.repositories.auth.graphqlToken(req);
			return { user, res };
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
				userById: async (parent, args, context) => {
					const { id } = args;
					const [user] = await this.repository.query({ id });
					return user;
				},
				users: (parent, args) => {
					console.log(args);
					const { input = {} } = args;
					return this.repository.getUsersPostgres(input);
				},
				// publicUsers: (parent, args, context) => {
				// 	return this.repository.getUsersPostgres(input);
				// },
				allUsers: (parent, args, context) => {
					// if ()
					return repository.getUsersPostgres();
				},
				getFriendsForUser: async (parent, args) => {
					console.log(args);
					const { input = {} } = args;
					const users = await this.repository.getUsersPostgres(input);
					const [user] = users;
					return user;
				},
				friends: async (parent, args, context) => {
					const { user } = context;
					if (!user?.id) return [];
					console.log(user?.id);
					const friends = await this.api.repositories.friends.query({
						member1_id: user.id
					});
					return friends;
				},
				generateToken: async (parent, { id, username, opts }, context) => {
					const { res } = context;
					const { admin = false } = context.user;
					if (!admin) return '';
					this.repository.query({ id, username });
					const token = this.auth.createJWT(user);
				}
			},

			Mutation: {
				createUser: async (parent, args) => {
					const { input } = args;
					const user = await this.repository.createUser(input);
					return user;
				},
				updateUser: async (parent, args, context) => {
					if (!context.user) return; // 'not signed in';
					let query;
					if (context.user.admin === true) {
						const { input = {}, data } = args;
						if (Object.keys(input).length > 0) {
							query = input;
						}
					}
					// update self if not admin
					if (!query) {
						query = context.user.id;
					}
					const op = await this.repository.update(query, args);
					const user = await this.repository.query(query);
					return user;
				},
				createGuest: async (parent, args, context) => {
					try {
						const { res } = context;
						const { username, password } = args.input;
						const op = await this.repository.createGuest(username, password);
						if (op.error) return op;
						const token = await this.api.repositories.auth.initJWT(res, op.user);

						return op;
					} catch (e) {
						console.trace(e);
						console.log('error');
					}
				},
				convertGuest: async (parent, { password }, { user, res }) => {
					const op = await this.api.repositories.auth.convertGuest({
						id: user.id,
						password
					});
					if (op.error) return op;
					const [updatedUser] = await this.repository.query({ id: user.id });
					const token = await this.api.repositories.auth.initJWT(res, updatedUser);
					return { ...op, user: updatedUser };
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
					const output = parent.map(({ member2_id }) => member2_id);
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
			},
			User: {
				online: async (parent, args, context) => {
					const status = await this.repository.getOnlineStatus(parent);
					return status;
				}
			}
		};
	}
}

module.exports = UserSchema;
