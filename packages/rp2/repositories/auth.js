var Repository = require('./repository.js');
const { JWT_SECRET } = require('../config.js');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const bcrypt = require('bcrypt');
const collection = 'users.auth';
// UNUSED
class AuthRepository extends Repository {
	constructor(api) {
		super(api, collection);
	}
	extractJWTData(user) {
		const { bit_id: id, username, oauth_id } = user;
		return { id, username, oauth_id };
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
	authenticateToken(req, res, next) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (token == null) return res.sendStatus(401);

		jwt.verify(token, JWT_SECRET, (err, user) => {
			console.log(err);
			if (err) return res.sendStatus(403);
			req.user = user;
			next();
		});
	}
	parseToken(token) {
		return new Promise((resolve, reject) => {
			jwt.verify(token, JWT_SECRET, (err, user) => {
				console.log(err);
				if (err) return resolve(false);
				resolve(user);
			});
		});
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
		return publicUserData;
		// this.saveJWTCookie()
	}
}

module.exports = AuthRepository;
