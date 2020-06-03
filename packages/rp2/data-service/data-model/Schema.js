const { gql, SchemaDirectiveVisitor } = require('apollo-server-express');
const getRawSchema = require('data-model');

class GraphqlSchemaInstance {
	constructor(api) {
		this.api = api;
		// Get repoName name from subclass;
		this.repoName = this.constructor.getRepoName(); //this.repoName || 'users';
		this.repository = api.repositories[this.repoName];
		// this.createRootQuery();
	}

	async createSchema() {
		await this.createTypeDefs();
		this.createResolvers();
		this.createContext();
		await this.createDirectiveResolvers();
		this.serverConfig = {
			typeDefs: this.typeDefs,
			resolvers: this.resolvers,
			context: this.context,
			directiveResolvers: this.directiveResolvers
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
	async createDirectiveResolvers() {}
	// unused
	async createRootQuery() {
		this.serverConfig = await this.createSchema();
		this.serverConfig = {
			typeDefs: this.typeDefs,
			resolvers: this.resolvers,
			directiveResolvers: this.directiveResolvers,
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
