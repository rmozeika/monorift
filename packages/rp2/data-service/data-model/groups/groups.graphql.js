const GraphqlSchemaInstance = require('../GraphqlSchema');

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
	setExtraRepos() {
		this.membersRepo = this.api.repositories.members;
		this.usersRepo = this.api.repositories.users;
	}
	createResolvers() {
		this.resolvers = {
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
				}
			},
			Mutation: {
				createGroup: async (parent, args, context) => {
					const { name } = args;
					const { user } = context;
					const group = await this.repository.create(name, user);
					return group;
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
					const [user] = await this.usersRepo.query(
						{ id: parent.creator },
						'oauth_id'
					);
					const { oauth_id } = user;
					return oauth_id;
				}
			},
			GroupMembersPayload: {
				group: async (parent, args, context) => {
					return parent;
				},
				members: async (parent, args, context) => {
					const members = await this.membersRepo.groupMembers(parent.gid);
					return members;
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
					//  ptr
					const users = await this.usersRepo.query({ id: ids });
					return users;
				}
			}
		};
	}
}

module.exports = GroupSchema;
