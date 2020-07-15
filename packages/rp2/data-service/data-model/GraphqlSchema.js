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
		this.repository = api.repositories[this.repoName];
		//super();
		this.setExtraRepos();
		console.log(this.setExtraRepos);
		const {
			repoName = 'users',
			repoNames = ['users', 'auth'],
			path = ''
		} = this.constructor;
		this.metadata = {
			name: repoName,
			repos: repoNames,
			path
		};
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
		if (this.schema) {
			return this.schema;
		}
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
	// setRepositories() {

	// }
	setExtraRepos = () => {
		const { repos } = this.metadata;
		repos.forEach(this.setExtraRepo);
	};
	setExtraRepo = name => {
		this[name] = this.api.repositories[name];
	};
	_schemas = {};
}

module.exports = GraphqlSchemaInstance;
