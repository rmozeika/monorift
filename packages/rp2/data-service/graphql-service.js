const Users = require('./data-model/users/users.graphql.js');
const Groups = require('./data-model/groups/groups.graphql.js');
const Messages = require('./data-model/messages/messages.graphql.js');

const { merge } = require('lodash');
const { mergeSchemas, makeExecutableSchema } = require('graphql-tools'); // could be graphql-tools / apollo-server-express

class GraphqlService {
	constructor(api) {
		this.api = api;
	}
	apiTypes = {
		users: Users,
		groups: Groups,
		messages: Messages
	};
	schemas = {};
	instances = {};
	context = async ({ req, res, connection, ...restProps }) => {
		if (connection) {
			// const user = await this.api.repositories.auth.parseBearer(
			// 	connection.context?.authorization
			// );
			return connection.context;
		}
		console.log(this);
		const user = await this.api.repositories.auth.graphqlToken(req);
		return { user, res };
	};
	async createSchemas() {
		const { api } = this;
		//const userSchema = new Users(api);
		//const apolloConfig = await userSchema.createSchema();
		//await this.createContext();
		const createdConfig = await Promise.all(
			Object.keys(this.apiTypes).map(async type => this.createApiSchema(type))
		).catch(e => {
			console.trace(e.stack);
		});
		return {
			modules: [...createdConfig],
			context: this.context,
			subscriptions: {
				onConnect: async (connectionParams, webSocket, ctx) => {
					const user = await this.api.repositories.auth.userFromRawHeaders(
						ctx?.request?.headers?.cookie
					);
					return { user };
				}
			}
		};
		//const schema = this.makeExecutable(createdConfig);
		//return schema;
	}
	async createApiSchema(type) {
		const { api } = this;
		const schemaInstance = new this.apiTypes[type](api);
		this.instances[type] = schemaInstance;
		const schema = await schemaInstance.createSchema();
		this.schemas[type] = schema;
		return schema;
	}
	// (currently using modules) unused, may have later use cases
	makeExecutable(configs) {
		const typeDefs = configs.map(({ typeDefs }) => typeDefs);
		const resolvers = configs.map(({ resolvers }) => resolvers);
		const mergedResolvers = merge.apply(this, resolvers);
		const execSchema = makeExecutableSchema({
			typeDefs,
			resolvers: mergedResolvers
		});
		return execSchema;
	}
	// (currently using modules) unused, may have later use cases
	async mergeSchemas(createdConfig) {
		const mergedSchemas = mergeSchemas({
			schemas: createdConfig
			//context: this.context
		});
		return {
			schema: mergedSchemas,
			context: this.context
		};
	}
}

module.exports = GraphqlService;
