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
console.log(Source);
class GraphqlSchemaInstance {
	constructor(api) {
		this.api = api;
		this.repository = api.repositories[this.repoName];
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
			console.log(parsed);
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
