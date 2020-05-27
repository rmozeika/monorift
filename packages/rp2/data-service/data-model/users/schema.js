const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLList
} = require('graphql');
const User = new GraphQLObjectType({
	name: 'user',
	fields: () => ({
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

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		users: {
			type: new GraphQLList(User)
		}
	}
});
const Schema = new GraphQLSchema({
	query: RootQuery
});

module.exports = { Schema, User };

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
