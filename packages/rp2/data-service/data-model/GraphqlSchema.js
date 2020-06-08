const { gql, SchemaDirectiveVisitor } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { remote } = require('../../config');
let getRawSchema;
if (remote == 'false') {
	getRawSchema = require('data-model');
} else {
	getRawSchema = require('../../../data-model');
}

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
		//this.createContext();
		await this.createDirectiveResolvers();
		this.schema = {
			typeDefs: this.typeDefs,
			resolvers: this.resolvers
			// context: this.context,
			// directiveResolvers: this.directiveResolvers
		};
		// this.serverConfig = {
		// 	schema: this.schema,
		// 	//context:
		// }
		const eSchema = makeExecutableSchema(this.schema);
		return eSchema;
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
}

module.exports = GraphqlSchemaInstance;
