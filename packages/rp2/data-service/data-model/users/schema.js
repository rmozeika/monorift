const GraphqlSchemaInstance = require('../Schema');

const {
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
	createRootQuery() {
		const { repository } = this;
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
						data: { type: UsersInput }
					},
					resolve: (parent, args) => {
						console.log(args);
						const { data = {} } = args;
						return this.repository.getUsersPostgres(data);
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
						data: { type: UsersInput }
					},
					resolve: async (parent, args) => {
						const { data } = args;
						const user = await this.repository.createUser(data);
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
		// email: { type: GraphQLString },
		// email: { type: GraphQLString },
		usingTempUsername: { type: GraphQLBoolean },
		mocked: { type: GraphQLBoolean },
		bit_id: { type: GraphQLInt },
		src: { type: Src }
	})
});

const UsersInput = new GraphQLInputObjectType({
	name: 'UsersInput',
	fields: () => ({
		id: { type: GraphQLInt },
		username: { type: GraphQLString },
		email: { type: GraphQLString },
		// email: { type: GraphQLString },
		// email: { type: GraphQLString },
		usingTempUsername: { type: GraphQLBoolean },
		mocked: { type: GraphQLBoolean },
		bit_id: { type: GraphQLInt }
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

module.exports = UserSchema;
const mongodbScheme = {
	$jsonSchema: {
		required: ['email', 'username', 'oauth_id'],
		properties: {
			email: {
				bsonType: 'string',
				description: 'must be a string and is required'
			},
			username: {
				bsonType: 'string',
				description: 'must be a string and is required'
			},
			oauth_id: {
				bsonType: 'string',
				description: 'id used globally: must be a string and is required'
			},
			src: {
				bsonType: 'object',
				required: [],
				properties: {
					firstname: { bsonType: 'string' },
					lastname: { bsonType: 'string' },
					// 'email': { bsonType: 'string' },
					displayName: { bsonType: 'string' },
					email: { bsonType: 'string' },
					gravatar: { bsonType: 'object' }
				}
			},
			mocked: {
				bsonType: 'boolean'
			},
			bit_id: {
				bsonType: 'integar'
			}
		}
	}
};
