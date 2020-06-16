const Repository = require('../repository.js');

class GroupsRepository extends Repository {
	constructor(api) {
		super(api);
		//this.add('mongo15');
		this.members = this.api.repositories['members'];
		this.images = this.api.repositories['images'];
		// this.createAllNullGroupIcons();
	}
	static getNamespaces() {
		return {
			collection: 'groups',
			table: 'groups'
		};
	}
	// async testGet() {
	// 	const result = await this.query({ name: 'generalchao'}, `src->'gravatar'->>'uri'`);
	// 	console.log(result);
	// }
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
		const gravatar = await this.images.createGroupIcon(name);
		const src = { gravatar };

		const [group] = await this.insert({ name: name, creator: creator.id, src }, [
			'gid',
			'name',
			'creator',
			'src'
		]);
		return group;
	}
	async createAdminMember({ gid, uid, oauth_id }) {
		const memberInsert = await this.members.insert({ gid, uid, oauth_id });
		return memberInsert;
	}
	async createAllNullGroupIcons() {
		const groups = await this.query({});
		console.log(groups);
		const filtered = groups.filter(group => !group?.src?.gravatar?.uri);
		console.log(filtered);
		const result = await Promise.all(
			filtered.map(async ({ name, gid }) => {
				const gravatar = await this.images.createGroupIcon(name);
				const src = { gravatar };
				const updateOp = await this.update({ gid }, { src });
				return updateOp;
			})
		);
		console.log(result);
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
