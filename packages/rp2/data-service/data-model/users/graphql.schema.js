const GraphqlSchemaInstance = require('../Schema');

const {
	buildSchema,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLList,
	GraphQLInputObjectType
} = require('graphql');

const repo = 'users';
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
	createSchema() {
		this.UserFriend = new GraphQLObjectType({
			name: 'user_friend',
			// type: User,
			// resolve: async (parent, args, roote, ast) => {
			// 	const { member2_id: id } = parent;
			// 	// const user = await this.repository.getUserById(id);
			// 	const users = await this.repository.query({ id });
			// 	const [ user ] = users;
			// 	console.log(user);
			// 	return user;
			// }
			fields: () => ({
				user: {
					type: User,
					resolve: async (parent, args, roote, ast) => {
						const { member2_id: id } = parent;
						// const user = await this.repository.getUserById(id);
						const users = await this.repository.query({ id });
						const [user] = users;
						console.log(user);
						return user;
					}
				}
			})
		});
		this.FriendsList = new GraphQLObjectType({
			name: 'friends_list',
			fields: () => ({
				ids: {
					type: new GraphQLList(GraphQLString),
					resolve: (parent, args) => {
						const output = [];
						parent.forEach(({ member2_id }) => output.push(member2_id));
						return output;
					}
				},
				users: {
					type: new GraphQLList(User),
					resolve: async (parent, args, context) => {
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
			})
		});
		this.UserWithFriends = new GraphQLObjectType({
			name: 'user_friends',
			fields: () => ({
				id: { type: GraphQLInt },
				username: { type: GraphQLString },
				email: { type: GraphQLString },

				usingTempUsername: { type: GraphQLBoolean },
				mocked: { type: GraphQLBoolean },
				bit_id: { type: GraphQLInt },
				src: { type: Src },
				friends: {
					// type: new GraphQLList(this.UserFriend),
					type: this.FriendsList,
					resolve: async (parent, args, context) => {
						const { id, admin } = context.user;
						// const { id } = parent;
						const user = await this.api.repositories.friends.query({
							member1_id: id
						});
						return user;
					}
				}
			})
		});
	}
	createRootQuery() {
		this.createSchema();
		const { repository, UserWithFriends } = this;
		this.RootQuery = new GraphQLObjectType({
			name: 'RootQueryType',
			fields: {
				user: {
					type: User,
					args: {
						id: { type: GraphQLInt }
					},
					resolve: (parent, args) => {
						const { id } = args;
						return this.repository.getUserById(id);
						// return repository.findById(id);
					}
				},
				users: {
					type: new GraphQLList(User),
					args: {
						input: { type: UserInput }
					},
					resolve: (parent, args) => {
						console.log(args);
						const { input = {} } = args;
						return this.repository.getUsersPostgres(input);
					}
				},
				allUsers: {
					type: new GraphQLList(User),
					resolve: () => {
						return repository.getUsersPostgres();
					}
				},
				createUser: {
					type: User,
					args: {
						input: { type: UserInput }
					},
					resolve: async (parent, args) => {
						const { input } = args;
						const user = await this.repository.createUser(input);
						return user;
					}
				},
				friends: {
					type: new GraphQLList(Friend),
					args: {
						input: { type: FriendInput }
					},
					resolve: async (parent, args) => {
						const { input } = args;
						const user = await this.api.repositories.friends.query({
							member1_id: input.id
						});
						return user;
					}
				},
				getFriendsForUser: {
					type: UserWithFriends,
					args: {
						input: { type: UserInput }
					},
					resolve: async (parent, args) => {
						console.log(args);
						const { input = {} } = args;
						const users = await this.repository.getUsersPostgres(input);
						const [user] = users;
						return user;
					}
				}
			}
		});
		this._Schema = new GraphQLSchema({
			query: this.RootQuery
		});
	}
	get schemas() {
		return this._schemas;
	}
	_schemas = {
		User,
		Src,
		GravatarSrc
	};

	// get Schema() {
	// 	const Schema = new GraphQLSchema({
	// 		query: RootQuery
	// 	});
	// }
	get Schema() {
		return this._Schema;
	}
}
const User = new GraphQLObjectType({
	name: 'user',
	fields: () => ({
		id: { type: GraphQLInt },
		username: { type: GraphQLString },
		email: { type: GraphQLString },
		oauth_id: { type: GraphQLString },
		mongo_id: { type: GraphQLString },
		guest: { type: GraphQLBoolean },
		mocked: { type: GraphQLBoolean },
		gravatar: { type: GraphQLString }
	})
});

const UserMongo = new GraphQLObjectType({
	id: { type: GraphQLInt },
	username: { type: GraphQLString },
	email: { type: GraphQLString },
	oauth_id: { type: GraphQLString },
	usingTempUsername: { type: GraphQLBoolean },
	mocked: { type: GraphQLBoolean },
	bit_id: { type: GraphQLInt },
	src: { type: Src }
});

const UserInput = new GraphQLInputObjectType({
	name: 'UserInput',
	fields: () => ({
		id: { type: GraphQLInt },
		username: { type: GraphQLString },
		email: { type: GraphQLString },
		usingTempUsername: { type: GraphQLBoolean },
		mocked: { type: GraphQLBoolean },
		bit_id: { type: GraphQLInt },
		password: { type: GraphQLString }
	})
});
const Src = new GraphQLObjectType({
	name: 'src',
	fields: () => ({
		first_name: { type: GraphQLString },
		last_name: { type: GraphQLString },
		displayName: { type: GraphQLString },
		gravatar: { type: GravatarSrc }
	})
});

const GravatarSrc = new GraphQLObjectType({
	name: 'gravatar',
	fields: () => ({
		uri: { type: GraphQLString },
		path: { type: GraphQLString },
		url: { type: GraphQLString }
	})
});
const Friend = new GraphQLObjectType({
	name: 'friend',
	fields: () => ({
		status: { type: GraphQLString },
		member1_id: { type: GraphQLInt },
		member2_id: { type: GraphQLInt },
		mocked: { type: GraphQLBoolean }
	})
});

const FriendInput = new GraphQLInputObjectType({
	name: 'FriendInput',
	fields: () => ({
		id: { type: GraphQLInt }
	})
});
module.exports = UserSchema;
