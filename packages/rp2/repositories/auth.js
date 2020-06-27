var Repository = require('./repository.js');
const { JWT_SECRET } = require('../config.js');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const bcrypt = require('bcrypt');
const collection = 'users.auth';
// UNUSED
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
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);
		this.insertOne({ id, hash: hashedPassword });
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
