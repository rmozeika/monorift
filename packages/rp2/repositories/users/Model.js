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
		this.password = password;
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
			oauth_id,
			username,
			email,
			usingTempUsername,
			src,
			mocked,
			guest,
			bit_id
		};
	}
	async insert() {
		try {
			await this.generateOAuthId();
			await this.checkUsernameExists();
			await this.createGravatar();
			const insertMongoOp = await this.repo.insertOne(this.data);
			this._id = insertMongoOp.insertedId.toString();
			this.bit_id = await this.repo.insertUserIntoPostgres(this._id, this.data);
			const updateBitOp = await this.repo.updateByOAuthId(this.oauth_id, {
				bit_id: this.bit_id
			});
			await this.handlePassword();
			return this.data;
		} catch (e) {
			throw new Error(e);
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
			const { username, error } = validateUsernamePassword(
				this.username,
				this.password
			);
			if (error) return new Error({ error: error, success: false });
			const authData = await this.repo.api.repositories.auth.storeAuth(
				this.bit_id,
				this.password
			);
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