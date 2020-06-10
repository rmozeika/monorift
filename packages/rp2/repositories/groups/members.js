const Repository = require('../repository.js');

class MembersRepository extends Repository {
	constructor(api) {
		super(api);
	}
	static getNamespaces() {
		return {
			collection: null,
			table: 'members'
		};
	}
	async groupMembers(gid) {
		const members = await this.query({ gid });
		return members;
	}
	async add({ gid, uid }) {
		const insertOp = await this.insert({ uid, gid });
		console.log(insertOp);
	}
	// testAdd() {
	// 	Promise.all([
	// 		this.add({ gid: 1, uid: 9401 }),
	// 		this.add({ gid: 1, uid: 9419 }),
	// 		this.add({ gid: 1, uid: 9409 })
	// 	]).then(result => {
	// 		console.log(result);
	// 	});
	// }
}

module.exports = MembersRepository;
