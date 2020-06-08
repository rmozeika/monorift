const Users = require('./data-model/users/users.graphql.js');
const Groups = require('./data-model/groups/groups.graphql.js');

const { mergeSchemas } = require('graphql-tools'); // could be graphql-tools / apollo-server-express

class GraphqlService {
	constructor(api) {
		this.api = api;
	}
	apiTypes = {
		users: Users,
		groups: Groups
	};
	schemas = {};
	instances = {};
	createContext() {
		this.context = async ({ req, res }) => {
			const user = await this.api.repositories.auth.graphqlToken(req);
			return { user, res };
		};
	}
	async createSchemas() {
		const { api } = this;
		//const userSchema = new Users(api);
		//const apolloConfig = await userSchema.createSchema();
		await this.createContext();
		const createdConfig = await Promise.all(
			Object.keys(this.apiTypes).map(async type => this.createApiSchema(type))
		).catch(e => {
			console.error(e);
		});

		const mergedSchemas = mergeSchemas({
			schemas: createdConfig
			//context: this.context
		});
		return {
			schema: mergedSchemas,
			context: this.context
		};
		return apolloConfig;
	}
	async createApiSchema(type) {
		const { api } = this;
		const schemaInstance = new this.apiTypes[type](api);
		this.instances[type] = schemaInstance;
		const schema = await schemaInstance.createSchema();
		this.schemas[type] = schema;
		return schema;
	}
}

module.exports = GraphqlService;
