const Repository = require('../repository.js');

class MembersRepository extends Repository {
	constructor(api) {
		super(api);
		//this.add('testers');
	}
	static getNamespaces() {
		return {
			collection: null,
			table: 'members'
		};
	}
	async add(name) {
		const insertOp = await this.insertAll({ name: name });
		console.log(insertOp);
	}
}

module.exports = MembersRepository;
