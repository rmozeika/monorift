var express = require('express');
var router = express.Router();
const authenticateSession = require('../middleware/session-secured');
const { authenticateToken } = require('../middleware/jwt');
const { useSession } = require('../config');
var Route = require('./route.js');

const routeName = '/users';
const repoName = 'users';
const util = require('util');

const authenticate = !useSession ? authenticateToken : authenticateSession;
class UserRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
		setImmediate(() => {
			this.router.get('/', authenticate, this.retrieveAll.bind(this));
			// this.router.get('/all', authenticate, this.fetchUserList.bind(this));
			// this.router.post('/all', authenticate, this.fetchUserList.bind(this));
			this.router.get('/all', this.fetchUserList.bind(this));
			this.router.post('/all', this.fetchUserList.bind(this));

			this.router.post('/', authenticate, this.retrieveAll.bind(this));
			this.router.post('/createUser', authenticate, this.createUser.bind(this));
			// this.router.post('/online', authenticate, this.createUser.bind(this));
			this.router.post('/online', this.fetchOnlineUsers.bind(this));
			this.router.post('/friends', authenticate, this.fetchFriends.bind(this));
			this.router.post('/friends/add', authenticate, this.addFriend.bind(this));
			this.router.post(
				'/friends/accept',
				authenticate,
				this.acceptFriend.bind(this)
			);
			this.router.post(
				'/friends/reject',
				authenticate,
				this.rejectFriend.bind(this)
			);
			this.router.get('/username', authenticate, this.getUser.bind(this));
			this.router.post(
				'/username/temp',
				authenticate,
				this.updateTempUsername.bind(this)
			);
			this.router.post(
				'/guest/register',
				this.api.bruteforce.prevent,
				this.registerAsGuest.bind(this)
			);
		});
	}
	getUserFromReq(req) {
		if (!useSession) {
			const { user = {} } = req;
			return user;
		} else {
			const { user = {} } = req.session && req.session.passport;
			return user;
		}
	}

	retrieveAll(req, res) {
		// var accessGroups = 'sysadmin';
		// if (!this.checkPermission({ req, res }, accessGroups)) return;
		const test = async () => {
			// const user = await this.repository.findByUsername('darkness94');
			const users = await this.repository.findAll();
			res.send(users);
		};
		test();
		// this.repository.findAll((err, data) => {
		//     res.send(data);
		// });
	}

	createUser(req, res) {
		var accessGroups = 'sysadmin';
		if (!this.checkPermission({ req, res }, accessGroups)) return;

		const { username, password, privledges } = req.body;
		const user = Object.assign({}, { username, password, privledges });
		this.repository.createUser(user, (err, data) => {
			if (err) throw err;
			res.send(data);
		});
	}
	getUser(req, res) {
		const { user } = req;
		return res.send(user);
	}
	// users postgres
	async fetchUserList(req, res) {
		// const auth = this.api.repositories['auth'];
		// const token = auth.createJWT({ username: 'test'});
		// auth.saveJWTCookie(res, token);
		console.log(req.user);
		// const username = this.getUserNameFromReq(req);
		const user = this.getUserFromReq(req);
		const { username } = user;
		// if (!username) {
		// 	const users = await this.repository.getUsersPostgres();
		// 	res.send(users);
		// 	return;
		// }
		const users = await this.repository.getUsersPostgresByFriendStatus(username);
		res.send(users);
	}
	async registerAsGuest(req, res) {
		const { username, password } = req.body;
		const user = await this.repository
			.createGuest(username, password)
			.catch(e => {
				res.send({ success: false });
			});
		if (!user) return;
		const token = this.api.repositories.auth.initJWT(res, user);
		const publicUserData = this.repository.getPublicUser(user);
		res.send({ success: true, user: publicUserData });
	}
	// unused
	fetchOnlineUsers(req, res) {
		console.log(this);
		const { username = false } = this.getUserFromReq(req);

		const redisCmd = util.promisify(this.api.redis.SMEMBERS).bind(this.api.redis);
		redisCmd('online_users').then(result => {
			const filtered = result.filter(user => username !== user);
			const objUsers = filtered.map(user => {
				return { username: user };
			});
			res.send(objUsers);
		});
	}
	// unused
	async fetchFriends(req, res) {
		const { username } = this.getUserFromReq(req);

		const friends = await this.repository.getFriendsForUser(username);
		res.send(friends);
	}
	async addFriend(req, res) {
		const { username } = this.getUserFromReq(req);
		const { friend } = req.body;
		console.log(username);
		const result = await this.repository.addFriend(username, friend.username);
		res.send(true);
	}
	async acceptFriend(req, res) {
		const { username } = this.getUserFromReq(req);
		const { friend } = req.body;
		console.log(username);
		this.repository.acceptFriend(username, friend.username);
		res.send(true);
	}
	async rejectFriend(req, res) {
		const { username } = this.getUserFromReq(req);
		const { friend } = req.body;
		console.log(username);
		this.repository.rejectFriend(username, friend.username);
	}
	async updateTempUsername(req, res) {
		const user = this.getUserFromReq(req);
		const { username: tempUsername } = user;
		const { username } = req.body;
		const result = await this.repository
			.updateTempUsername(tempUsername, username)
			.catch(e => {
				console.log(e);
			});
		if (result.succes === false) {
			return res.send(result);
		}
		const newCookieData = { ...user, username };
		const token = this.api.repositories.auth.initJWT(res, newCookieData);
		if (useSession) {
			req.session.passport.user.username = username;
		}
		// const newUser = this.api.repositories.auth.saveJWTCookie(res, newCookie);
		// change to JWT
		// if (result.success) {
		// 	req.session.passport.user.username = username;
		// }
		res.send(result);
	}
}

module.exports = UserRoute;
