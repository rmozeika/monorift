const Repository = require('../repository.js');

class GroupsRepository extends Repository {
	constructor(api) {
		super(api);
		//this.add('mongo15');
		this.members = this.api.repositories['members'];
	}
	static getNamespaces() {
		return {
			collection: 'groups',
			table: 'groups'
		};
	}
	async get({ gid, name } = {}) {
		const groups = await this.query({ name, gid });
		return groups;
	}
	async create(name, creator) {
		let status = { success: true, error: null, group: null };
		try {
			const { oauth_id, id } = creator;
			const group = await this.add(name, creator);
			status.group = group;
			const { gid } = group;
			const memberInsert = await this.createAdminMember({
				gid,
				uid: id,
				oauth_id
			});
			return status;
		} catch (e) {
			console.trace(e.stack);
			status.success = false;
			status.error = e.message;
			return status;
		}
	}
	async add(name, creator) {
		const [group] = await this.insert({ name: name, creator: creator.id }, [
			'gid',
			'name',
			'creator'
		]);

		// .catch(e => {
		// 	if (e) {
		// 		status.success = false;
		// 		status.error = e.message;
		// 	}
		// 	return [{}];
		// });
		// if (status.error) return status;

		// await this.members.insert({ gid, uid: id, oauth_id }).catch(e => {
		// 	if (e) {
		// 		status.success = false;
		// 		status.error = e.message;
		// 	}
		// 	return [{}];
		// });
		return group;
	}
	async createAdminMember({ gid, uid, oauth_id }) {
		const memberInsert = await this.members.insert({ gid, uid, oauth_id });
		return memberInsert;
	}
}

function gqlError(e) {
	let status = { success: true, error: null, group: null };
	if (e) {
		status.success = false;
		status.error = e.message;
	}
	return status;
}

module.exports = GroupsRepository;
