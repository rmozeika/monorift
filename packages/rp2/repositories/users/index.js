const Repository = require('../repository.js');
const UserModel = require('./Model');
const collection = 'users';
const tableName = 'users';
// friendship status
// A = accepted
// S = SENT
// P = PENDING
const friendStatus = {
	accepted: 'A',
	sent: 'S',
	pending: 'P',
	rejected: 'R'
};

class UserRepository extends Repository {
	constructor(api) {
		super(api);
		this.findByUsername.bind(this);
		//this.testQuery();
	}
	static getNamespaces() {
		return {
			collection: 'users',
			table: 'users'
		};
	}
	Model = UserModel;
	async getUsersPostgres(query = {}) {
		console.log(this.db);
		const users = await this.query(query);
		return users;
	}

	async insertUserIntoPostgres(_id, user) {
		const { username, src, email, oauth_id, guest = false } = user;
		const [id] = await this.postgresInstance
			.knex('users')
			.returning('id')
			// .returning('id').as('BIT_ID')
			.insert({
				username: username,
				mongo_id: _id,
				src: { email, ...src },
				email,
				oauth_id,
				gravatar: src.gravatar.uri,
				guest
			});
		return id;
	}

	createUser(user, cb) {
		return new Promise(async (resolve, reject) => {
			// let user;

			// let { username, src, email, oauth_id } = user;
			// if (/monorift\|/.test(oauth_id)) {
			// 	const salt = await bcrypt.genSalt();
			// 	oauth_id = `${oauth_id}${salt}`.substring(0, 24);
			// 	// user.oauth_id = oauth
			// }
			// const userData = { ...user, username, src, email, oauth_id };
			try {
				const userModel = new UserModel(user, this);
				const userData = await userModel;
				console.log(userData);
				const insertUserOp = await userModel.insert();
				console.log(userModel.data);
				resolve(userModel.data);
				// const userData = await new UserModel(user, this);
				// const insertMongoOp = await this.mongoInstance.insertOne(this.collection, userData);
				// const insertMongoOp = await this.insertOne(userData);

				// const _id = insertMongoOp.insertedId.toString();
				// const bit_id = await this.insertUserIntoPostgres(_id, userData);
				// const updateBitOp = await this.updateByOAuthId(oauth_id, { bit_id });
			} catch (e) {
				reject(e);
			}
			// .catch(e => {
			// 	reject(e);
			// });
			if (false == true) {
				console.log(userData);
				this.existingUser(oauth_id, username)
					// this.findByUsername(username)
					.then(foundUser => {
						if (foundUser) {
							if (foundUser.username !== username) {
								userData.oauth_id = oauth_id + '1';
								return true;
							}
							const message = `Username '${username}' already exists`;
							reject(message);
							throw new Error(message);
							return false;
						}
						return true;
					})
					.then(proceed => {
						if (proceed) {
							return this.createGravatar(oauth_id, email);
						}
					})
					.then(gravatarData => {
						userData.src['gravatar'] = gravatarData;
						return;
					})
					.then(() => this.findByUsername(username))
					.then(foundUser => {
						if (foundUser) return false;
						return this.mongoInstance.insertOne(this.collection, userData);
					})
					.then(result => {
						// user = user;
						if (result == false) return false;
						const _id = result.insertedId.toString();
						return this.insertUserIntoPostgres(_id, userData);
					})
					.then(async bit_id => {
						const updateOp = await this.updateByOAuthId(oauth_id, { bit_id });
						return { ...userData, bit_id };
					})
					.then(result => {
						if (cb) return cb(result);
						resolve(result);
					})
					.catch(e => {
						console.error(e);
					});
			}
		});
	}
	async importProfile(profile, cb) {
		const { id, email, emails, nickname, mocked = false } = profile;
		const oauth_id = profile.oauth_id || id;
		const username = nickname || profile.username;
		let emailVal;
		if (email) {
			emailVal = email;
		} else {
			const [{ value }] = emails;
			emailVal = value;
		}
		const existingUser = await this.findOne({ username });
		// need to add random to stop breaking upon multiple temps
		const tempUsername = existingUser && username + '_temp';
		const obj = {
			email: emailVal,
			username: tempUsername || username,
			usingTempUsername: !!tempUsername,
			oauth_id,
			src: profile,
			mocked
		};
		return this.createUser(obj, cb);
	}
	async createGuest(username, password) {
		const { success = true, error, ...user } = await this.createUser({
			username,
			password
		}).catch(e => {
			console.error(e);
			// return Promise.resolve({ error: e.message, success: false });
			return { error: e.message, success: false };
			//return Promise.reject(e);
		});
		if (success == false) return { success, error };

		//const publicUserData = this.Model.publicData(user);

		return { error, success, user };
	}
	async createGuestOld(inputUsername, password) {
		const { username, error } = validateUsernamePassword(inputUsername, password);
		if (error) return { error: error, success: false };
		const id = 'guest'; // TODO: get id
		const email = `${username}@monorift.com`;
		const guest = {
			username,
			oauth_id: `monorift|${username}`,
			usingTempUsername: false,
			email,
			src: {},
			mocked: false,
			guest: true
		};
		const user = await this.createUser(guest).catch(e => {
			console.error(e);
			return Promise.reject(e);
		});
		const authData = await this.api.repositories.auth.storeAuth(
			user.bit_id,
			password
		);
		return user;
		// this.createGravatar(id, email)
		// 		.then(gravatarData => {
		// 			userData.src['gravatar'] = gravatarData;
		// 			return;
		// 		})
		// 		.then(this.findByUsername(username))
		// 		.then(foundUser => {
		// 			if (foundUser) return false;
		// 			return this.mongoInstance.insertOne(this.collection, userData);
		// 		})
	}
	async getBitIdByUsername(username) {
		const opts = { project: { bit_id: 1 } };
		const { bit_id = false } = await this.findOne({ doc: { username }, opts });
		return bit_id;
	}
	async findByUsername(username, cb) {
		return this.findOne({ username }, cb);
	}
	async findById(id) {
		return this.findOne({ oauth_id: id });
	}
	async existingUser(id, username) {
		return this.findOne({ $or: [{ username }, { oauth_id: id }] });
	}
	getPublicUser({ _id, socket_id, ...user }) {
		return user;
	}

	updateByOAuthId(id, doc, opts) {
		return this.updateOne({
			filter: { oauth_id: id },
			doc: { $set: doc },
			opts
		});
	}
	getId(query) {
		return this.query(query, 'id');
	}
	getDbIds(query) {
		return this.query(query, { pgID: 'id', mongoID: 'mongo_id' });
	}
	async updateUser(query) {
		const { pgID, mongoID } = await this.getDbIds(query); // this.query(query, 'id');
	}
	updateByUsername(username, doc, opts = {}) {
		return this.updateOne({
			filter: { username },
			doc: { $set: doc },
			opts
		});
	}
	async updateUserByUsernamePostgres(username, column, value) {
		const [userId] = await this.getUsersIdsByUsername([username]);
		const update = await this.postgresInstance
			.knex('users')
			.update(column, value)
			.where({ id: userId });
		return update;
	}
	async updateTempUsername(tempUsername, username) {
		const existing = await this.findOne({ username });
		if (existing) return { taken: true, success: false };
		const updateOperation = await this.updateByUsername(tempUsername, {
			usingTempUsername: false,
			username,
			usingTempUsername: false
		}).catch(e => {
			console.log('update temp username error');
			console.error(e);
			// CHANGE THIS
			return { taken: false, success: false };
		});
		const updatePostgres = await this.updateUserByUsernamePostgres(
			tempUsername,
			'username',
			username
		);
		return { taken: false, success: true };
	}
	// postgres
	// async getUser(query) {

	// }
	async getUserById(id) {
		const users = await this.query({ id: id });
		console.log(users);
		const [user] = users;
		return user;
	}

	async getUsersPostgresByFriendStatus(username) {
		// console.log
		let users;
		if (username) {
			const [{ id }] = await this.postgresInstance.client
				.select('id')
				.from('users')
				.where('username', '=', username);
			users = await this.postgresInstance.client
				.select(
					'users.id',
					'users.username',
					'users.src',
					'friendship.status',
					'users.oauth_id',
					'users.gravatar'
				)
				.from('users')
				.where('id', '!=', id)
				.leftJoin('friendship', function() {
					this.on('friendship.member2_id', '=', 'users.id').andOn(
						'friendship.member1_id',
						'=',
						id
					);
				})
				.orderBy('friendship.status')
				.catch(e => {
					console.error(e);
				});
		} else {
			users = await this.getUsersPostgres();
		}

		const usersWithOnlineStatus = await Promise.all(
			users.map(async user => {
				const online = await this.api.redisAsync('getbit', 'online_bit', user.id);
				return { ...user, online: online == 1 };
			})
		);

		return usersWithOnlineStatus;
	}
	async getOnlineStatus(user) {
		let id;
		if (Number.isInteger(user)) {
			id = user;
		} else {
			id = user.id;
		}
		if (!id) return false;
		const online = await this.api.redisAsync('getbit', 'online_bit', id);
		return online == 1;
	}
	async addOnlineStatus(users) {
		const usersList = Array.isArray(users) ? users : [users];

		const usersWithOnlineStatus = await Promise.all(
			usersList.map(async user => {
				const online = await this.api.redisAsync('getbit', 'online_bit', user.id);
				return { ...user, online };
			})
		);

		return usersWithOnlineStatus;
	}
	async getUserColumnsByUsername(usernames, columns) {
		const users = await this.postgresInstance
			.knex('users')
			.whereIn('username', usernames)
			.column(['username', ...columns])
			.select();
		const usersMapped = usernames.map(name => {
			const values = users.find(({ id, username }) => name == username);
			return values;
		});
		// const ids = users.map(({ id }) => id);
		return usersMapped;
	}
	async getUsersIdsByUsername(usernames) {
		// could use ordanality instead
		const users = await this.postgresInstance
			.knex('users')
			.whereIn('username', usernames)
			.select('id', 'username');
		const ids = usernames.map(name => {
			const { id } = users.find(({ id, username }) => name == username);
			return id;
		});
		// const ids = users.map(({ id }) => id);
		return ids;
	}

	async getFriendsForUser(username) {
		const friends = await this.postgresInstance
			.knex('users')
			.innerJoin('friendship', 'users.id', '=', 'friendship.member2_id')
			.where(
				'friendship.member1_id',
				this.postgresInstance
					.knex('users')
					.where('username', username)
					.select('id')
			)
			.select('users.id', 'users.username', 'friendship.status');
		return friends;
	}
	async deleteUser(query) {
		let filter = {};
		if (typeof query == 'string') {
			filter = { username: query };
		} else {
			filter = query;
		}
		const deleteMongo = await this.deleteOne(filter);
		const [user] = await this.getUsersPostgres(filter);

		const deleteFriends = await this.postgresInstance
			.knex('friendship')
			.where('member1_id', '=', user.id)
			.orWhere('member2_id', '=', user.id)
			.del();
		const deletePsql = await this.postgresInstance
			.knex('users')
			.where('id', user.id)
			.del();
		return { deleteMongo, deletePsql };
	}
	async testQuery() {
		const updateOp = await this.update(
			{ bit_id: 9403 },
			{ mocked: true, newField: 'test' }
		);

		// const updateOp1 = await this.update({ doc: { mocked: true, newField: 'test' }, filter: { bit_id: 9403 } });
		const users = await this.query({
			id: [9391, 9401],
			username: 'jcrosher3'
		});
		const usersOr = await this.queryMatching({
			id: [9391, 9401],
			username: 'kriccir'
		});
		console.log(users, usersOr);
	}
}

module.exports = UserRepository;
