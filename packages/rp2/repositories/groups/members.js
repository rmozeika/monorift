const Repository = require('../repository.js');

class MembersRepository extends Repository {
	constructor(api) {
		super(api);
		// this.testAdd();
	}
	static getNamespaces() {
		return {
			collection: null,
			table: 'members'
		};
	}
	async memberOfGroups(user) {
		// const uid = (typeof user === 'string') ? user : user.id;
		// const testUser = this.api.repositories.users.modelUser(user);
		const uid = this.api.repositories.users.Model.pgId(user);
		const entries = await this.query({ uid });
		return entries;
		console.log(entries);
	}
	async groupMembers(gid) {
		const members = await this.query({ gid });
		return members;
	}
	async add(gid, { id, oauth_id }) {
		let status = { success: true, error: null };
		try {
			let userOAuthId = oauth_id;
			if (!oauth_id) {
				let [foundId] = await this.api.repositories.users.query({ id }, 'oauth_id');
				userOAuthId = foundId.oauth_id;
			}
			const row = { uid: id, gid, oauth_id };
			const insertOp = await this.insert(row);
			return status;
		} catch (e) {
			console.trace(e);
			return { success: false, error: e };
		}
	}
	async remove(gid, { id }) {
		let status = { success: true, error: null };
		try {
			const toDelete = { uid: id, gid };
			const insertOp = await this.del(toDelete);
			return status;
		} catch (e) {
			console.trace(e);
			return { success: false, error: e };
		}
	}
	async isMemberOfGroup(gid, { id }) {
		const uid = this.api.repositories.users.Model.pgId(user);
		const entries = await this.query({ uid, gid }, 'uid');
		return entries.length > 0;
	}
}

module.exports = MembersRepository;
