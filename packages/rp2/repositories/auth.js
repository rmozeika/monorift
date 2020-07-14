var Repository = require('./repository.js');
const { JWT_SECRET } = require('../config.js');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const bcrypt = require('bcrypt');
const collection = 'users.auth';
// UNUSED
const {
	validateUsernamePassword
} = require('../data-service/data-model/users/validation.js');
class AuthRepository extends Repository {
	constructor(api) {
		super(api);
	}
	static getNamespaces() {
		return {
			collection: 'users.auth',
			table: null
		};
	}
	extractJWTData(user) {
		const { bit_id, id, username, oauth_id, admin = false } = user;
		return { id: id || bit_id, username, oauth_id, admin };
	}
	async initJWT(res, user) {
		const token = this.createJWT(user);
		await this.saveJWTCookie(res, token);
		return token;
	}
	createJWT(user) {
		const data = this.extractJWTData(user);
		const token = jwt.sign(data, JWT_SECRET);
		return token;
	}
	saveJWTCookie(res, token) {
		const expiration = 22000;
		res.cookie('token', token, {
			// expires: new Date(Date.now() + expiration),
			secure: true, // set to true if your using https
			httpOnly: true
		});
	}
	async parseBearer(authHeader) {
		const token = authHeader && authHeader.split(' ')[1];
		const user = await this.parseToken(token);
		return user;
	}
	authenticateToken(req, res, next) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (token == null) return res.sendStatus(401);

		jwt.verify(token, JWT_SECRET, (err, user) => {
			if (err) {
				console.error(err);
				return res.sendStatus(403);
			}
			req.user = user;
			next();
		});
	}
	getTokenFromHeader(req) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		return token;
	}
	graphqlToken(req) {
		return new Promise((resolve, reject) => {
			let token = req.cookies.token || this.getTokenFromHeader(req);
			if (token == null) return resolve({});

			jwt.verify(token, JWT_SECRET, (err, user) => {
				if (err) {
					console.error(err);
					reject(error);
					return;
				}
				resolve(user);
			});
		});
	}
	parseToken(token) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, JWT_SECRET, (err, user) => {
				if (err) {
					console.error(err);
					return resolve(false);
				}
				resolve(user);
			});
		});
	}
	async userFromRawHeaders(cookies) {
		// const { cookie: cookies = '' } = headers;
		const { token = false } = cookie.parse(cookies);
		if (!token) return false;
		return await this.parseToken(token);
	}
	async userFromSocket(socket) {
		const { cookie: cookies = '' } = socket.handshake.headers;
		const { token = false } = cookie.parse(cookies);
		if (!token) return false;
		return await this.parseToken(token);
	}
	async storeAuth(id, password) {
		try {
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(password, salt);
			const insertOp = await this.insertOne({ id, hash: hashedPassword });
			return { success: true };
		} catch (e) {
			return { error: e, success: false };
		}
	}
	async validateAuth({ id, password, username = false }) {
		const authEntryExists = await this.findOne({ id });
		if (authEntryExists)
			return {
				savedPassword: false,
				error:
					'Authentication data already exists for user, try a different username',
				success: false
			};
		//return new Error({ error: 'Authentication data already exists for user, try a different username', success: false });
		//const { username, password, error: validationError } =
		const validated = validateUsernamePassword(username, password);
		if (!password)
			return {
				success: true,
				message: 'signed up without password',
				savedPassword: false,
				username: validated.username,
				password: validated.password
			};

		const { error: validationError } = validated;
		if (validationError)
			return { error: validationError, success: false, savedPassword: false }; //return new Error({ error: error, success: false });
		return validated; //{ id, password, username };
	}
	async convertGuest({ id, password }) {
		try {
			const validated = await this.validateAuth({ id, password });
			if (validated.success == false || validated.error) return validated;
			let { success, error } = await this.storeAuth(id, validated.password).catch(
				e => {
					return { error: e, success: false, savedPassword: false };
				}
			);
			if (error || success == false) return { success, error };
			const opResult = await this.api.repositories.users
				.update({ id }, { guest: false })
				.catch(e => {
					return { error: e, success: false, savedPassword: true };
				});

			return { success: true, error: null, ...opResult };
		} catch (e) {
			return { error: e, success: false, savedPassword: true };
		}
	}
	async simpleAuth(username, password) {
		username = username.toLowerCase();
		const user = await this.api.repositories.users.findByUsername(username);
		if (!user) {
			return { error: 'User does not exist' };
		}
		const { bit_id: id } = user;
		const authData = await this.findOne({ id });
		const verify = await bcrypt.compare(password, authData.hash);
		if (!verify) {
			return { error: 'Incorrect password' };
		}
		const publicUserData = this.api.repositories.users.getPublicUser(user);

		// const user = await this.api.repositories.users.findById(authData.id);
		return { publicUser: publicUserData, user };
		// this.saveJWTCookie()
	}
	async authenticateSuperUser(req, res, next) {
		if (!req.user) return res.send(403);
		// const user = this.api.repositories.users.findById(req.user.id);
		if (req.user.admin !== true) return res.send(403);
		next();
	}
}

module.exports = AuthRepository;
