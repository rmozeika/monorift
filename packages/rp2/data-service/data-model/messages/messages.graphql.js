const GraphqlSchemaInstance = require('../GraphqlSchema');
const { PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();
class MessageSchema extends GraphqlSchemaInstance {
	repoName = 'messages';
	constructor(api) {
		super(api);
		this.setExtraRepos();
		// this.api = api;
		// this.repository = api.repositories[repo];
	}
	static getRepoName() {
		return 'messages';
	}
	// events = {
	// 	MEMBER_UPDATE: 'MEMBER_UPDATE'
	// 	// MEMBER_LEFT: 'MEMBER_LEFT'
	// };
	// enumTypes = {
	// 	MEMBER_UPDATE: {
	// 		JOINED: 'JOINED',
	// 		LEFT: 'LEFT'
	// 	}
	// };
	// static get events() {

	// }
	setExtraRepos() {
		// this.members = this.api.repositories.members;
		this.conversations = this.api.repositories.conversations;
		this.users = this.api.repositories.users;
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
					// Additional event labels can be passed to asyncIterator creation
					subscribe: async (_, { id, lastId }, { user }) => {
						const xread = await this.repository.listenForMore(id, lastId);
						return xread;
					}
					// withFilter(
					// 	() => pubsub.asyncIterator([this.events.MEMBER_UPDATE]),
					// 	(payload, variables) => {
					// 		return payload.id == variables.id;
					// 	}
					// )
				}
			},
			Query: {
				feed: async (parent, args, context) => {
					const { id } = args;
					return { id };
					const feed = await this.conversations.get({ id });
					return feed;
					// return repository.findById(id);
				}
			},
			// Mutation: {
			// 	// createMessage: async (parent, args, context) => {
			// 	// 	const { name } = args;
			// 	// 	const { user } = context;
			// 	// 	const message = await this.repository.create(name, user);
			// 	// 	return message;
			// 	// }
			// },
			Feed: {
				page: async (parent, args, context) => {
					const { user } = context;
					const { id } = parent;
					const page = await this.repository.existing(id, user.id);
					return page;
				}
			},
			// Page: {
			//     messages: async (parent, args, context) => {
			//         return { }
			//     }

			// }
			// MessagesPayload: {
			// 	data: parent => parent,
			// 	lists: async (parent, args, context) => {
			// 		return parent;
			// 	}
			// },
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
