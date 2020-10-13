const { gql, SchemaDirectiveVisitor } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const { remote } = require('../../config');
let getRawSchema;
if (remote == 'false') {
	getRawSchema = require('data-model');
} else {
	getRawSchema = require('../../../data-model');
}
var { Source, parse } = require('graphql'); // CommonJS

class GraphqlSchemaInstance {
	constructor(api) {
		this.api = api;

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
		this.repository = api.repositories[repoName];
		this.setExtraRepos();
	}

	async createSchema() {
		await this.createTypeDefs();
		this.createResolvers();
		await this.createDirectiveResolvers();
		this.schema = {
			typeDefs: this.typeDefs,
			resolvers: this.resolvers
		};
		if (this.schema) {
			return this.schema;
		}
		const eSchema = makeExecutableSchema(this.schema);
		return eSchema;
		return this.serverConfig;
	}
	async createTypeDefs() {
		const rawSchema = await getRawSchema(this.metadata.name);
		this.typeDefs = gql`
			${rawSchema}
		`;
		let src;
		try {
			src = new Source(rawSchema, 'raw');
			const parsed = parse(src);
		} catch (e) {
			console.error(e);
		}

		return;
	}
	async createDirectiveResolvers() {}
	async createRootQuery() {
		this.serverConfig = await this.createSchema();
		this.serverConfig = {
			typeDefs: this.typeDefs,
			resolvers: this.resolvers,
			directiveResolvers: this.directiveResolvers,
			context: this.context
		};
	}
	get schemas() {
		return this._schemas;
	}
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
