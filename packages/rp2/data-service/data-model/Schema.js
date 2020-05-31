const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
	GraphQLList
} = require('graphql');

class GraphqlSchemaInstance {
	constructor(api) {
		this.api = api;
		// Get repo name from subclass;
		const repo = this.constructor.getRepoName(); //this.repo || 'users';
		this.repository = api.repositories[repo];
		this.createRootQuery();
	}
	// createRootQuery() {
	// 	this.RootQuery = new GraphQLObjectType({
	// 		name: 'RootQueryType',
	// 		fields: {
	// 			users: {
	// 				type: new GraphQLList(User),
	// 				resolve: () => {
	// 					return api.repositories.users.getUsersPostgres();
	// 				}
	// 			},
	// 			user: {
	// 				type: User,
	// 				args: {
	// 					id: { type: GraphQLString }
	// 				},
	// 				resolve: (id) => {
	// 					api.repositories.users.getUserById(id);
	// 				}
	// 			}
	// 		}
	// 	});
	// }
	get schemas() {
		return this._schemas;
	}
	_schemas = {
		// User,
		// Src,
		// GravatarSrc,
	};
	get Schema() {
		const Schema = new GraphQLSchema({
			query: this.RootQuery
		});
	}
}
module.exports = GraphqlSchemaInstance;
