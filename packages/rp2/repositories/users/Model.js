var gravatar = require('gravatar');
const promisfy = require('util').promisify;
const http = require('http');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Jimp = require('jimp');
const path = require('path');

const {
	validateUsernamePassword
} = require('../../data-service/data-model/users/validation.js');

class UserModel {
	static mongoFields = [
		'_id',
		'bit_id',
		'username',
		'email',
		'oauth_id',
		'guest',
		'mocked',
		'src',
		'username',
		'usingTempUsername'
	];
	constructor(
		{
			email,
			username,
			oauth_id,
			guest = false,
			mocked = false,
			src = {},
			usingTempUsername = false,
			password = false
		},
		repo,
		isNewUser
	) {
		this.repo = repo;
		this.auth = this.repo.api.repositories.auth;
		this.username = username.toLowerCase();

		this.usingTempUsername = usingTempUsername;
		this.src = src;
		this.mocked = mocked;
		// if (oauth_id) {
		// 	this.checkUsernameExists();
		// }
		this.password = password;
		this.guest = guest;
		if (isNewUser !== false) {
			this.oauth_id = oauth_id || `monorift|${username}`;
			this.email = email || `${username}@monorift.com`;
			this.guest = !!password;
		}
	}
	async initFields() {
		await this.generateOAuthId();
		await this.checkUsernameExists();
		await this.createGravatar();
	}
	// await extends 'thenables'
	// e.g. const user = await new UserModel(...args)
	then(resolve, reject) {
		this.initFields()
			.then(() => {
				const data = this.data;
				resolve(data);
			})
			.catch(e => {
				reject(e);
			});
	}
	get data() {
		const {
			id,
			username,
			email,
			usingTempUsername,
			src,
			mocked,
			guest,
			oauth_id,
			bit_id
		} = this;
		return {
			id: id || bit_id,
			oauth_id,
			username,
			email,
			usingTempUsername,
			src,
			mocked,
			guest,
			bit_id: bit_id || id,
			gravatar: src?.gravatar?.uri
		};
	}
	static pgId(data) {
		let id;
		if (typeof data == 'string') {
			// change to oauth_id then get id from that
			return data;
		}
		if (typeof data == 'number') {
			return data;
		}
		return data.id || data.uid;
	}
	static publicData({ _id, socket_id, ...user }, includeNull = true) {
		return user;
	}
	static convertToMongo(user, includeNull = false) {
		//const mongoData = {};
		// this.mongoFields.forEach(key => {
		// 	const val = user[key] || null;
		// 	if (includeNull || (val !== null && val !== undefined)) {
		// 		mongoData[key] = val;
		// 	}
		// 	return;
		// });
		try {
			const mappedData = this.convertWithMappings(
				this.mongoMappings,
				user,
				includeNull
			);
			return mappedData;
		} catch (e) {
			console.trace(e);
		}
		// Object.entries(user).forEach(([key, value])=> {
		// 	if (this.mongoFields.indexOf(key)) {
		// 		mongoData[key] = value;
		// 	}
		// });
		//return mongoData;
	}
	static convertToPg(user = {}, includeNull = false) {
		const { pgMappings } = this;
		const pgData = {};
		Object.entries(pgMappings).forEach(([key, value]) => {
			let resultValue;
			if (typeof value == 'function') {
				resultValue = value(user);
				return;
			} else {
				resultValue = user[value];
			}
			if (includeNull || (resultValue !== null && resultValue !== undefined)) {
				pgData[key] = resultValue;
			}
		});
		return pgData;
	}
	static convertWithMappings(mappings, user = {}, includeNull = false) {
		try {
			const data = {};
			Object.entries(mappings).forEach(([key, value]) => {
				let resultValue;
				if (typeof value == 'function') {
					resultValue = value(user);
					return;
				} else {
					resultValue = user[value];
				}
				if (includeNull || (resultValue !== null && resultValue !== undefined)) {
					data[key] = resultValue;
				}
			});
			return data;
		} catch (e) {
			console.trace(e);
		}
	}
	static get pgMappings() {
		return {
			id: 'bit_id',
			username: 'username',
			mongo_id: '_id',
			src: 'src',
			email: 'email',
			oauth_id: 'oauth_id',
			gravatar: base => {
				return base?.src?.gravatar?.uri;
			},
			guest: 'guest',
			mocked: 'mocked'
		};
	}
	static get mongoMappings() {
		return {
			bit_id: 'id',
			username: 'username',
			// mongo_id: '_id',
			src: 'src',
			email: 'email',
			oauth_id: 'oauth_id',
			// gravatar: base => {
			// 	return base?.src?.gravatar?.uri;
			// },
			guest: 'guest',
			mocked: 'mocked'
		};
	}
	mapPg(base = this, includeNull = false) {
		// if (base)
		const { pgMappings } = this;
		const pgData = {};
		Object.entries(pgMappings).forEach(([key, value]) => {
			let resultValue;
			if (typeof value == 'function') {
				resultValue = value(base);
				return;
			} else {
				resultValue = base[value];
			}
			if (includeNull || resultValue !== null || resultValue !== undefined) {
				pgData[key] = resultValue;
			}
		});
		return pgData;
	}
	gravatarFromSource(src) {
		return src.gravatar.uri;
	}
	get postgresData() {
		const { username, oauth_id, _id, bit_id, id, email, src, guest } = this;
		const data = {
			username: username,
			mongo_id: _id,
			// id: bit_id,
			src: { email, ...src },
			email,
			oauth_id,
			gravatar: src.gravatar.uri,
			guest
		};
		if (bit_id || id) data.id = bit_id || id;
		return data;
	}
	get mongoData() {}
	async insert() {
		try {
			await this.generateOAuthId();
			await this.checkUsernameExists();
			await this.createGravatar();
			const insertMongoOp = await this.repo.insertOne(this.data);
			this._id = insertMongoOp.insertedId.toString();
			this.id = await this.repo.insertUserIntoPostgres(this._id, this.data);
			this.bit_id = this.id;
			const updateBitOp = await this.repo.updateByOAuthId(this.oauth_id, {
				bit_id: this.bit_id
			});
			const { success, error } = await this.handlePassword();
			return { data: this.data, success, error };
		} catch (e) {
			return { success: false, error: e };
		}
	}
	async generateOAuthId() {
		if (this.isMonoriftProviderUser()) {
			const salt = await bcrypt.genSalt();
			this.oauth_id = `${this.oauth_id}${salt}`.substring(0, 24);
			return;
		}
	}
	isMonoriftProviderUser() {
		return /^monorift/.test(this.oauth_id);
	}
	async checkUsernameExists() {
		const { username } = this;
		const existingUser = await this.repo.findOne({ username });
		// need to add random to stop breaking upon multiple temps
		// const tempUsername = existingUser && username + '_temp';
		if (!existingUser) {
			return;
		}
		if (this.isMonoriftProviderUser) {
			throw new Error(`username ${username} exists`);
			return;
		}
		if (existingUser) {
			this.username = username + '_temp';
			this.usingTempUsername = true;
			return;
		}
		// this.usingTempUsername = !!tempUsername;
	}
	async handlePassword() {
		if (this.password || this.isMonoriftProviderUser()) {
			// const authEntryExists = await this.auth.findOne({ username });
			// if (authEntryExists) return { error: 'Authentication data already exists for user, try a different username', success: false };
			// //return new Error({ error: 'Authentication data already exists for user, try a different username', success: false });
			// if (!this.password) return { success: true, message: 'signed up without password' };
			// const { error: validationError } = validateUsernamePassword(
			// 	this.username,
			// 	this.password
			// );
			// if (validationError) return { error: validationError, success: false }; //return new Error({ error: error, success: false });
			// const { error: validationError } = validateUsernamePassword(
			// 	this.username,
			// 	this.password
			// );
			const {
				error: validationError,
				username,
				password
			} = await this.auth.validateAuth({
				id: this.id,
				password: this.password,
				username: this.username
			});
			this.username = username;
			this.password = password;
			if (validationError) return { error: validationError, success: false }; //return new Error({ error: error, success: false });
			if (!password) return { success: true, error: null };
			const { success, error } = await this.repo.api.repositories.auth
				.storeAuth(this.bit_id, this.password)
				.catch(e => {
					return { error: e, success: false };
				});
			return { success, error };
		}
	}
	async createGravatar() {
		const { email, oauth_id: filename } = this;
		const gravatarUrl = gravatar.url(
			email,
			{ s: '40', r: 'x', d: 'retro' },
			false
		);
		const gravatarPath = path.resolve(
			__dirname,
			'../../public',
			'gravatar',
			`${filename}.png`
		);

		const file = fs.createWriteStream(gravatarPath);
		const response = await promiseGet(gravatarUrl);
		response.pipe(file);
		const usePng = true;
		// probably stick with png due to nature of gravatar
		// use jpg for other images
		if (usePng == true) {
			this.src.gravatar = {
				url: gravatarUrl,
				path: gravatarPath,
				uri: `/gravatar/${filename}.png`
			};
			return this.src.gravatar;
		}

		// unneeded
		const gravatarPathJpg = path.resolve(
			__dirname,
			'../../public',
			'gravatar',
			`${filename}.jpg`
		);
		const pngImg = await Jimp.read(gravatarPath);
		pngImg
			// .resize(256, 256) // resize
			// .quality(60) // set JPEG quality
			// .greyscale() // set greyscale
			.write(gravatarPathJpg); // save

		this.src.gravatar = {
			url: gravatarUrl,
			path: gravatarPathJpg,
			uri: `/gravatar/${filename}.jpg`
		};
		return this.src.gravatar;
	}
}
function promiseGet(url) {
	return new Promise((resolve, reject) => {
		http.get(url, response => {
			resolve(response);
		});
	});
}

module.exports = UserModel;
