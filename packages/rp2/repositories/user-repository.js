var Repository = require('./repository.js');

const collection = 'user-repository';

class UserRepository extends Repository {
	constructor(api) {
		super(api, collection);
		this.findByUsername.bind(this);
	}

	createUser(user, cb) {
		return this.mongoInstance.insertOne(this.collection, user, cb);
	}

	async findByUsername(username, cb) {
		return this.findOne({ username }, cb);
	}
	importProfile(profile, cb) {
		const { emails, username, nickname } = profile;
		const [{ value }] = emails;
		const obj = {
			email: value,
			username: nickname,
			src: profile
		};
		return this.createUser(obj, cb);
	}
	update({ doc, filter }, opts = {}) {
		return this.update({ filter, doc: { $set: doc }, opts }, type);
	}
	updateByUsername(username, doc, opts = {}) {
		return this.updateOne({
			filter: { username },
			doc: { $set: doc },
			opts
		});
	}
}

module.exports = UserRepository;
