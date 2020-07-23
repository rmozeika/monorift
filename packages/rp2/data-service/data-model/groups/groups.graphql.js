const GraphqlSchemaInstance = require('../GraphqlSchema');
const { PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();
class GroupSchema extends GraphqlSchemaInstance {
	static repoName = 'groups';
	static repoNames = ['members', 'auth', 'users'];
	static path = './data-model/schema.groups.graphql';

	constructor(api) {
		super(api);
	}

	events = {
		MEMBER_UPDATE: 'MEMBER_UPDATE'
	};
	enumTypes = {
		MEMBER_UPDATE: {
			JOINED: 'JOINED',
			LEFT: 'LEFT'
		}
	};

	createResolvers() {
		this.resolvers = {
			Subscription: {
				members: {
					subscribe: withFilter(
						() => pubsub.asyncIterator([this.events.MEMBER_UPDATE]),
						(payload, vals) => {
							return payload.members.gid == vals.gid;
						}
					)
				}
			},
			Query: {
				group: async (parent, args, context) => {
					const { gid, name } = args;
					const [group] = await this.repository.get({ gid, name });
					return group;
				},
				groups: async (parent, args, context) => {
					const { gid, name } = args;
					const groups = await this.repository.get();
					return groups;
				},
				groupMembers: async (parent, args, context) => {
					const { gid, name } = args;
					const [group] = await this.repository.get({ gid, name });
					return group;
				},
				memberOfGroups: async (parent, args, context) => {
					const { user } = context;
					const memberEntriesForUser = await this.members.memberOfGroups(user);
					const gids = memberEntriesForUser.map(({ gid }) => gid);
					return gids;
				},
				callSignature: async (parent, args, { user }) => {
					const genCallSignature = this.auth.callSignature(user.id);
					return genCallSignature;
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
					const { MEMBER_UPDATE } = this.events;
					const { JOINED } = this.enumTypes[MEMBER_UPDATE];
					const payload = {
						members: {
							update: JOINED,
							gid,
							uid: user.id
						}
					};
					pubsub.publish(MEMBER_UPDATE, payload);

					return op;
				},
				leave: async (parent, args, context) => {
					const { gid } = args;
					const { user } = context;
					const op = await this.members.remove(gid, user);
					if (op.success === false) return op;
					const { MEMBER_UPDATE } = this.events;
					const { LEFT } = this.enumTypes[MEMBER_UPDATE];

					const payload = {
						members: { update: LEFT, gid, uid: user.id }
					};
					pubsub.publish(MEMBER_UPDATE, payload);

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
				memberOf: (parent, args, context) => {
					const allIds = parent.map(({ gid }) => gid);
					return allIds;
				}
			},
			Group: {
				creator_oauth_id: async (parent, args, context) => {
					const [user] = await this.users.query({ id: parent.creator }, 'oauth_id');
					const { oauth_id } = user;
					return oauth_id;
				},
				gravatar: async (parent, args, context) => {
					const gravatar = parent?.src?.gravatar?.uri;
					return gravatar;
				},
				memberOf: async ({ gid }, args, context, info) => {
					console.log(info);
					const { user } = context;
					const isMember = await this.members.isMemberOfGroup(gid, user);
					return isMember;
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
					const users = await this.users.query({ id: ids });
					return users;
				}
			},
			GroupsDataAndIds: {
				gids: async (parent, args, context) => {
					return parent;
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
