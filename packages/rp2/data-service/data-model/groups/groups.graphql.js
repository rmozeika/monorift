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
					const group = await this.repository.get({ gid, name });
					return group;
					// return repository.findById(id);
				},
				groupMembers: async (parent, args, context) => {
					const { gid, name } = args;
					const group = await this.repository.get({ gid, name });
					return group;
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
				users: async (parent, args, context) => {
					const ids = parent.map(({ uid }) => uid);
					//  ptr
					const users = await this.usersRepo.query({ id: ids });
					return users;
				}
			}
			// Mutation: {
			// 	createUser: async (parent, args) => {
			// 		const { input } = args;
			// 		const user = await this.repository.createUser(input);
			// 		return user;
			// 	},

			// },
		};
	}
}

module.exports = GroupSchema;
