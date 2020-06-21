const GraphqlSchemaInstance = require('../GraphqlSchema');
const { PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();
class GroupSchema extends GraphqlSchemaInstance {
	repoName = 'groups';
	constructor(api) {
		super(api);
		this.setExtraRepos();
		// this.api = api;
		// this.repository = api.repositories[repo];
	}
	static getRepoName() {
		return 'groups';
	}
	events = {
		MEMBER_JOINED: 'MEMBER_JOINED'
	};
	// static get events() {

	// }
	setExtraRepos() {
		this.members = this.api.repositories.members;
		this.usersRepo = this.api.repositories.users;
	}
	createResolvers() {
		this.resolvers = {
			Subscription: {
				memberJoined: {
					// Additional event labels can be passed to asyncIterator creation
					subscribe: withFilter(
						() => pubsub.asyncIterator([this.events.MEMBER_JOINED]),
						(payload, variables) => {
							return payload.memberJoined.gid == variables.gid;
						}
					)
				}
			},
			Query: {
				group: async (parent, args, context) => {
					const { gid, name } = args;
					const [group] = await this.repository.get({ gid, name });
					return group;
					// return repository.findById(id);
				},
				groups: async (parent, args, context) => {
					const { gid, name } = args;
					const groups = await this.repository.get();
					return groups;
					// return repository.findById(id);
				},
				groupMembers: async (parent, args, context) => {
					const { gid, name } = args;
					const [group] = await this.repository.get({ gid, name });
					return group;
				},
				memberOfGroups: async (parent, args, context) => {
					const { user } = context;
					const memberEntriesForUser = await this.members.memberOfGroups(user);
					// return memberEntriesForUser;

					const gids = memberEntriesForUser.map(({ gid }) => gid);
					return gids;
				}
			},
			Mutation: {
				createGroup: async (parent, args, context) => {
					const { name } = args;
					const { user } = context;
					const group = await this.repository.create(name, user);
					return group;
				},
				join: async (parent, args, context) => {
					const { gid } = args;
					const { user } = context;
					const op = await this.members.add(gid, user);
					if (op.success === false) return op;
					const { MEMBER_JOINED } = this.events;
					const payload = {
						memberJoined: { gid, id: user.id }
					};
					pubsub.publish(MEMBER_JOINED, payload);

					return op;
				}
			},
			GroupsPayload: {
				data: parent => parent,
				lists: async (parent, args, context) => {
					return parent;
				}
			},
			GroupLists: {
				master: (parent, args, context) => {
					const allIds = parent.map(({ gid }) => gid);
					return allIds;
				},
				// TODO CHANGE THIS; same as master right now incorrectly
				memberOf: (parent, args, context) => {
					const allIds = parent.map(({ gid }) => gid);
					return allIds;
				}
			},
			Group: {
				creator_oauth_id: async (parent, args, context) => {
					const [user] = await this.usersRepo.query(
						{ id: parent.creator },
						'oauth_id'
					);
					const { oauth_id } = user;
					return oauth_id;
				},
				gravatar: async (parent, args, context) => {
					const gravatar = parent?.src?.gravatar?.uri;
					return gravatar;
				}
			},
			GroupMembersPayload: {
				group: async (parent, args, context) => {
					return parent;
				},
				members: async (parent, args, context) => {
					const members = await this.members.groupMembers(parent.gid);
					return members;
				}
			},
			JoinGroupPayload: {
				payload: async (parent, args, context) => {
					const { gid } = args;
					const [group] = await this.repository.get({ gid });
					return group;
				}
				// group: async (parent, args, context) => {
				// 	const group = await this.repository.get({ gid: args.gid });
				// 	return group;
				// }
			},
			Members: {
				uids: async (parent, args, context) => {
					const uids = parent.map(({ uid }) => uid);
					return uids;
				},
				oauth_ids: (parent, args, context) => {
					const oauth_ids = parent.map(({ oauth_id }) => oauth_id);
					return oauth_ids;
				},
				users: async (parent, args, context) => {
					const ids = parent.map(({ uid }) => uid);
					//  ptr
					const users = await this.usersRepo.query({ id: ids });
					return users;
				}
			},
			GroupsDataAndIds: {
				gids: async (parent, args, context) => {
					const gids = parent; //.map(({ gid }) => gid);
					return gids;
				},
				data: async (parent, args, context) => {
					const groups = await this.repository.query({ gid: parent });
					return groups;
				}
			}
		};
	}
}

module.exports = GroupSchema;
