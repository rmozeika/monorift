var Repository = require('./repository.js');

const collection = 'users';

class UserRepository extends Repository {
	constructor(api) {
		super(api, collection);
		this.findByUsername.bind(this);
	}

	createUser(user, cb) {
		return new Promise((resolve, reject) => {
			// let user;
			const { username, src, email } = user;

			this.findByUsername(username)
				.then(foundUser => {
					if (foundUser) return false;
					return this.mongoInstance.insertOne(this.collection, user);
				})
				.then(result => {
					// user = user;
					if (result == false) return false;
					const _id = result.insertedId.toString();
					return this.insertUserIntoPostgres(_id, user);
				})
				.then(result => {
					if (cb) return cb(user);
					resolve(user);
				})
				.catch(e => {
					console.log(e);
				});
		});
	}
	async insertUserIntoPostgres(_id, user) {
		const { username, src, email } = user;
		const inserted = await this.postgresInstance
			.knex('users')
			.insert({ username: username, mongo_id: _id, src: { email, ...src } });
		return inserted;
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
	async addFriend(username, friend) {
		const userIds = await this.postgresInstance
			.knex('users')
			.whereIn('username', [username, friend])
			.select('id');
		console.log(userIds);
		const inserted1 = await this.postgresInstance
			.knex('friendship')
			.insert({ member1_id: userIds[0].id, member2_id: userIds[1].id });
		const inserted2 = await this.postgresInstance
			.knex('friendship')
			.insert({ member1_id: userIds[1].id, member2_id: userIds[0].id });

		return { inserted1, inserted2 };
	}
	async getFriendsForUser(username) {
		const userIds = await this.postgresInstance
			.knex('users')
			.innerJoin('friendship', 'users.id', '=', 'friendship.member2_id')
			.where(
				'friendship.member1_id',
				this.postgresInstance
					.knex('users')
					.where('username', username)
					.select('id')
			);
		console.log(userIds);
	}
}

module.exports = UserRepository;
