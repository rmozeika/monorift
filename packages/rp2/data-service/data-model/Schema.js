const { gql } = require('apollo-server-express');
const getRawSchema = require('data-model');

class GraphqlSchemaInstance {
	constructor(api) {
		this.api = api;
		// Get repoName name from subclass;
		this.repoName = this.constructor.getRepoName(); //this.repoName || 'users';
		this.repository = api.repositories[this.repoName];
		// this.createRootQuery();
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
	async createSchema() {
		await this.createTypeDefs();
		this.createResolvers();
		this.createContext();
		this.serverConfig = {
			typeDefs: this.typeDefs,
			resolvers: this.resolvers,
			context: this.context
		};
		return this.serverConfig;
	}
	async createTypeDefs() {
		const rawSchema = await getRawSchema(this.repoName);
		this.typeDefs = gql`
			${rawSchema}
		`;
		return;
	}
	// unused
	async createRootQuery() {
		this.createSchema();
		this.serverConfig = {
			typeDefs: this.typeDefs,
			resolvers: this.resolvers,
			context: this.context
		};
		// const apolloSchema = makeExecutableSchema(this.serverConfig);
		// this.RootQuery = apolloSchema;
	}
	get schemas() {
		return this._schemas;
	}
	_schemas = {};
	// get Schema() {
	// 	const Schema = new GraphQLSchema({
	// 		query: this.RootQuery
	// 	});
	// }
}
module.exports = GraphqlSchemaInstance;
