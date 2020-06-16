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
	async add({ gid, uid, oauth_id }) {
		let userOAuthId = oauth_id;
		if (!oauth_id) {
			let [foundId] = await this.api.repositories.users.query(
				{ id: uid },
				'oauth_id'
			);
			userOAuthId = foundId.oauth_id;
		}
		const insertOp = await this.insert({ uid, gid, oauth_id: userOAuthId });
		console.log(insertOp);
	}
	testAdd() {
		Promise.all([
			this.add({ gid: 1, uid: 9401 }),
			this.add({ gid: 1, uid: 9419 }),
			this.add({ gid: 1, uid: 9409 })
		]).then(result => {
			console.log(result);
		});
	}
}

module.exports = MembersRepository;
