const Repository = require('../repository.js');

class GroupsRepository extends Repository {
	constructor(api) {
		super(api);
		//this.add('mongo15');
	}
	static getNamespaces() {
		return {
			collection: 'groups',
			table: 'groups'
		};
	}
	async get({ gid, name }) {
		const [group] = await this.query({ name, gid });
		return group;
	}
	async add(name) {
		console.log('read');
		const insertOp = await this.insert({ name: name });
		console.log(insertOp);
	}
}

module.exports = GroupsRepository;
