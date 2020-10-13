const GraphqlSchemaInstance = require('../GraphqlSchema');
const { update } = require('lodash');
const { ADMIN_SECRET } = require('../../../config.js');
class UserSchema extends GraphqlSchemaInstance {
	static repoName = 'users';
	static repoNames = ['members', 'auth', 'friends'];
	static path = './data-model/schema.graphql';
	constructor(api) {
		super(api);
	}

	createContext() {
		this.context = async ({ req, res }) => {
			const user = await this.auth.graphqlToken(req);
			return { user, res };
		};
	}
	createResolvers() {
		this.resolvers = {
			Query: {
				user: (parent, args) => {
					const { id } = args;
					return this.repository.getUserById(id);
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
				allUsers: (parent, args, context) => {
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
				generateToken: async (parent, { input, opts }, context) => {
					const { res, admin = false } = context;
					const { saveToReq = false } = opts;
					// const { admin = false } = context?.user;
					if (!admin) return '';
					const [user] = await this.repository.query(input);
					const token = this.auth.createJWT(user);
					if (saveToReq) this.auth.saveJWTCookie(res, token);
					return { token, message: 'created token for ' + user.username };
				}
			},

			Mutation: {
				createUser: async (parent, args) => {
					const { input } = args;
					const user = await this.repository.createUser(input);
					return user;
				},
				updateUser: async (parent, args, context) => {
					let query;
					if (context.user.admin === true) {
						const { input = {}, data } = args;
						if (Object.keys(input).length > 0) {
							query = input;
						}
					}
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
						const token = await this.auth.initJWT(res, op.user);

						return op;
					} catch (e) {
						console.trace(e);
						console.log('error');
					}
				},
				convertGuest: async (parent, { password }, { user, res }) => {
					const op = await this.auth.convertGuest({
						id: user.id,
						password
					});
					if (op.error) return op;
					const [updatedUser] = await this.repository.query({ id: user.id });
					const token = await this.auth.initJWT(res, updatedUser);
					return { ...op, user: updatedUser };
				}
			},

			UserWithFriends: {
				friends: async (parent, args, context) => {
					const { id, admin } = context.user;
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
					const ids = parent.map(({ member2_id }) => member2_id);
					const users = await this.repository.query({ id: ids });
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
