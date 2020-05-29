var Repository = require('./repository.js');
var gravatar = require('gravatar');
const promisfy = require('util').promisify;
const http = require('http');
const fs = require('fs');
const collection = 'users';
const path = require('path');
const bcrypt = require('bcrypt');
const Jimp = require('jimp');
const {
	validateUsernamePassword
} = require('../data-service/data-model/users/users.js');

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

class UserModel {
	constructor(
		{
			email,
			username,
			oauth_id,
			guest = false,
			mocked = false,
			src = {},
			usingTempUsername = false
		},
		repo
	) {
		this.repo = repo;
		this.username = username;

		this.email = email || `${username}@monorift.com`;
		this.usingTempUsername = usingTempUsername;
		this.src = src;
		this.mocked = mocked;
		this.guest = guest;
		// if (oauth_id) {
		// 	this.checkUsernameExists();
		// }
		this.oauth_id = oauth_id || `monorift|${username}`;
	}
	async initFields() {
		await this.generateOAuthId();
		await this.checkUsernameExists();
	}
	// await extends 'thenables'
	// e.g. const user = await new UserModel(...args)
	then(resolve, reject) {
		this.initFields().then(() => {
			const data = this.data;
			resolve(data);
		});
	}
	get data() {
		const { username, email, usingTempUsername, src, mocked, guest } = this;
		return {
			username,
			email,
			usingTempUsername,
			src,
			mocked,
			guest
		};
	}
	async generateOAuthId() {
		if (this.isMonoriftProviderUser()) {
			const salt = await bcrypt.genSalt();
			this.oauth_id = `${this.oauth_id}${salt}`.substring(0, 24);
			return;
		}
	}
	isMonoriftProviderUser() {
		return !/^monorift/.test(this.oauth_id);
	}
	async checkUsernameExists() {
		const { username } = this;
		const existingUser = await this.repo.findOne({ username });
		// need to add random to stop breaking upon multiple temps
		// const tempUsername = existingUser && username + '_temp';
		if (existingUser) {
			this.username = username + '_temp';
			this.usingTempUsername = true;
			return;
		}
		// this.usingTempUsername = !!tempUsername;
	}
}
class UserRepository extends Repository {
	constructor(api) {
		super(api, collection);
		this.findByUsername.bind(this);
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
	async createGravatar(filename, email) {
		const gravatarUrl = gravatar.url(
			email,
			{ s: '40', r: 'x', d: 'retro' },
			false
		);
		const getPromise = promisfy(http.get);
		const gravatarPath = path.resolve(
			__dirname,
			'../public',
			'gravatar',
			`${filename}.png`
		);

		const file = fs.createWriteStream(gravatarPath);
		const response = await promiseGet(gravatarUrl);
		response.pipe(file);
		const usePng = true; // probably stick with png due to nature of gravatar
		if (usePng == true) {
			return {
				url: gravatarUrl,
				path: gravatarPath,
				uri: `/gravatar/${filename}.png`
			};
		}

		const gravatarPathJpg = path.resolve(
			__dirname,
			'../public',
			'gravatar',
			`${filename}.jpg`
		);
		const pngImg = await Jimp.read(gravatarPath);
		pngImg
			// .resize(256, 256) // resize
			// .quality(60) // set JPEG quality
			// .greyscale() // set greyscale
			.write(gravatarPathJpg); // save
		return {
			url: gravatarUrl,
			path: gravatarPathJpg,
			uri: `/gravatar/${filename}.jpg`
		};
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
			const userData = await new UserModel(user, this);
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
	userDataBase(data) {
		const {
			email,
			username,
			oauth_id,
			guest = false,
			mocked = false,
			src = {},
			usingTempUsername = false
		} = data;
		if (!username) {
			return new Error('username undefined');
		}
		return {
			username,
			oauth_id: oauth_id || `monorift|${username}`,
			email: email || `${username}@monorift.com`,
			usingTempUsername,
			src,
			mocked,
			guest
		};
	}
	async createGuest(inputUsername, password) {
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
	getPublicUser({ bit_id, _id, socket_id, ...user }) {
		return user;
	}

	update({ doc, filter }, opts = {}) {
		return this.update({ filter, doc: { $set: doc }, opts }, type);
	}
	updateByOAuthId(id, doc, opts) {
		return this.updateOne({
			filter: { oauth_id: id },
			doc: { $set: doc },
			opts
		});
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
		const [user = {}] = await this.getUsersPostgres({ id });
		return user;
		// .postgresInstance.knex('users')
		// 	.where(id)
	}
	async getUsersPostgres(query = {}) {
		const users = await this.postgresInstance
			.knex('users')
			.where(query)
			.select('*');
		return users;
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
	async publishFriendStatus(status, to, from) {
		if (typeof to == 'string') {
			return this.api.redisAsync(
				'publish',
				`${user}:friend_request`,
				`${friend}:${status}`
			);
		}
		return this.api.redisAsync(
			'publish',
			`${to.oauth_id}:friend_request`,
			`${from.oauth_id}:${status}`
		);
	}
	async acceptFriend(username, friendUsername) {
		const [user, friend] = await this.getUserColumnsByUsername(
			[username, friendUsername],
			['oauth_id', 'id']
		);
		const accepted = await this.postgresInstance
			.knex('friendship')
			.update('status', friendStatus.accepted)
			.where({ member1_id: user.id, member2_id: friend.id })
			.orWhere({ member1_id: friend.id, member2_id: user.id });
		const updateToFriend = await this.publishFriendStatus(
			friendStatus.accepted,
			friend,
			user
		);
		const updateToSelf = await this.publishFriendStatus(
			friendStatus.accepted,
			user,
			friend
		);

		return accepted;
	}

	async rejectFriend(username, friendUsername) {
		const [user, friend] = await this.getUserColumnsByUsername(
			[username, friendUsername],
			['oauth_id', 'id']
		);
		const reject = await this.postgresInstance
			.knex('friendship')
			.update('status', friendStatus.rejected)
			.where({ member1_id: user.id, member2_id: friend.id })
			.orWhere({ member1_id: friend.id, member2_id: user.id });
		const updateToFriend = await this.publishFriendStatus(
			friendStatus.rejected,
			friend,
			user
		);
		const updateToSelf = await this.publishFriendStatus(
			friendStatus.rejected,
			user,
			friend
		);

		return { reject };
	}
	async addFriend(username, friendUsername, mocked = false) {
		// const [userId, friendId] = await this.getUsersIdsByUsername([
		// 	username,
		// 	friend
		// ]);

		const [user, friend] = await this.getUserColumnsByUsername(
			[username, friendUsername],
			['oauth_id', 'id']
		);
		const existing = await this.postgresInstance
			.knex('friendship')
			.select('status')
			.where('member1_id', '=', user.id)
			.andWhere('member2_id', '=', friend.id);
		if (existing.length > 0) return {};
		const inserted1 = await this.postgresInstance.knex('friendship').insert({
			member1_id: user.id,
			member2_id: friend.id,
			status: friendStatus['sent'],
			mocked
		});
		const inserted2 = await this.postgresInstance.knex('friendship').insert({
			member1_id: friend.id,
			member2_id: user.id,
			status: friendStatus['pending'],
			mocked
		});
		const updateToFriend = await this.publishFriendStatus(
			friendStatus.pending,
			friend,
			user
		);
		const updateToSelf = await this.publishFriendStatus(
			friendStatus.sent,
			user,
			friend
		);

		return { inserted1, inserted2 };
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
	// resetUsers() {

	// }
}

function userDataBase(data) {
	const {
		email,
		username,
		oauth_id,
		guest = false,
		mocked = false,
		src = {},
		usingTempUsername = false
	} = data;
	if (!username) {
		return new Error('username undefined');
	}
	return {
		username,
		oauth_id: oauth_id || `monorift|${username}`,
		email: email || `${username}@monorift.com`,
		usingTempUsername,
		src,
		mocked,
		guest
	};
}
function promiseGet(url) {
	return new Promise((resolve, reject) => {
		http.get(url, response => {
			resolve(response);
		});
	});
}

module.exports = UserRepository;
