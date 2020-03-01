var express = require('express');
var router = express.Router();
const secured = require('../middleware/secured');
var Route = require('./route.js');

const routeName = '/users';
const repoName = 'users';
const util = require('util');
class UserRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
		setImmediate(() => {
			this.router.get('/', secured(), this.retrieveAll.bind(this));
			this.router.post('/', secured(), this.retrieveAll.bind(this));
			this.router.post('/createUser', secured(), this.createUser.bind(this));
			// this.router.post('/online', secured(), this.createUser.bind(this));
			this.router.post('/online', this.fetchOnlineUsers.bind(this));
			this.router.post('/friends', this.fetchFriends.bind(this));

			this.router.get('/username', secured(), this.getUser.bind(this));
		});
	}
	getUserNameFromReq(req) {
		if (
			!req.session ||
			!req.session.passport ||
			!req.session.passport.user ||
			!req.session.passport.user.username
		)
			return '';
		const { username } =
			req.session && req.session.passport && req.session.passport.user;
		return username;
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
	fetchOnlineUsers(req, res) {
		console.log(this);
		const username = this.getUserNameFromReq(req);

		console.log(username);
		const redisCmd = util.promisify(this.api.redis.SMEMBERS).bind(this.api.redis);
		redisCmd('online_users').then(result => {
			const filtered = result.filter(user => username !== user);
			const objUsers = filtered.map(user => {
				return { name: user };
			});
			res.send(objUsers);
		});
	}
	async fetchFriends(req, res) {
		const username = this.getUserNameFromReq(req);

		const friends = await this.repository.getFriendsForUser(username);
		res.send(friends);
	}
	addFriend(req, res) {
		const username = this.getUserNameFromReq(req);
		console.log(username);
	}
}

module.exports = UserRoute;
