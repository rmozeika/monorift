const GraphqlSchemaInstance = require('../GraphqlSchema');
const { PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();
class MessageSchema extends GraphqlSchemaInstance {
	static repoName = 'messages';
	static path = './data-model/schema.messages.graphql';
	static repoNames = ['auth', 'users', 'conversations'];
	constructor(api) {
		super(api);
	}
	createResolvers() {
		this.resolvers = {
			Subscription: {
				feedMessages: {
					resolve: result => {
						if (Array.isArray(result)) [result] = result;
						console.log(result);
						return result;
					},
					subscribe: async (_, { id, lastId }, { user }) => {
						const xread = await this.repository.listenForMore(user.id, id, lastId);
						return xread;
					}
				},
				messageNotifications: {
					resolve: result => {
						if (Array.isArray(result)) [result] = result;
						console.log(result);
						return result;
					},
					subscribe: async (_, { id, lastId }, { user }) => {
						const xread = await this.repository.listenForMore(user.id, id, lastId);
						return xread;
					}
				}
			},
			Query: {
				feed: async (parent, args, context) => {
					const { id } = args;
					return { id };
					const feed = await this.conversations.get({ id });
					return feed;
				}
			},
			Feed: {
				page: async (parent, args, context) => {
					const { user } = context;
					const { id } = parent;
					const page = await this.repository.existing(id, user.id);
					return page;
				}
			},
			Message: {
				datetime: ({ time }, args, context) => {
					return new Date(time).toISOString();
				},
				from: async ({ from }, args, context) => {
					return from;
				},
				user: async ({ from }, args, context) => {
					const user = await this.users.getUserById(from);
					return user;
				}
			}
		};
	}
}

module.exports = MessageSchema;
