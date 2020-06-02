var express = require('express');
var router = express.Router();
const authenticateSession = require('../middleware/session-secured');
const { authenticateToken } = require('../middleware/jwt');
const { useSession } = require('../config');

var Route = require('./route.js');

const routeName = '/friends';
const repoName = 'friends';
const util = require('util');
//tag
function route(...args) {
	console.log([...args]);
	return [...args];
}
const authenticate = !useSession ? authenticateToken : authenticateSession;
class UserRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
		setImmediate(() => {
			// this.router.get('/', authenticate, this.retrieveAll.bind(this));
			this.router.post('/', authenticate, this.fetchFriends.bind(this));
			// this.router.post('/add', authenticate, this.addFriend.bind(this));
			this.router.post('/accept', authenticate, this.acceptFriend.bind(this));
			this.router.post('/reject', authenticate, this.rejectFriend.bind(this));
		});
	}
	static publicStaticMethod() {
		return { method: this.addFriend, route: '/add' };
	}
	staticNewField = {
		method: this.rejectFriend,
		route: '/reject'
	};
	static fetchUserList() {
		return '/users';
	}
	// static routeTypes() {
	//     return {
	//         '/': 'fetchFriends',
	//         '/add': 'addFriends'
	//     };
	// }
	get routeTypes() {
		return {
			// [Symbol('post')]: [ '/', 'fetchUserList' ],
			'/add': ['post', this.addFriend, authenticate],
			'/reject': ['post', this.rejectFriend]

			// '/add': ['addFriends'],
		};
	}
	get protectRoutes() {
		return {
			'/add': authenticate
		};
	}
	routeConfig(path, middleware = []) {}
	addFriendRoute() {
		return this.routeConfig('/');
	}

	addFriendRouteTag = this.route`post/add${this.addFriend}${authenticate}`;

	// [route`addFriend ${'hello'}`] = async (req, res) => {
	//     const { username } = this.getUserFromReq(req);
	// 	const { friend } = req.body;
	// 	const result = await this.repository.addFriend(username, friend.username);
	// 	res.send(true);
	// }
	async addFriend(req, res) {
		const { username } = this.getUserFromReq(req);
		const { friend } = req.body;
		const result = await this.repository.addFriend(username, friend.username);
		res.send(true);
	}
	async acceptFriend(req, res) {
		const { username } = this.getUserFromReq(req);
		const { friend } = req.body;
		this.repository.acceptFriend(username, friend.username);
		res.send(true);
	}
	async rejectFriend(req, res) {
		const { username } = this.getUserFromReq(req);
		const { friend } = req.body;
		this.repository.rejectFriend(username, friend.username);
	}
	// users postgres
	async fetchUserList(req, res) {
		const user = this.getUserFromReq(req);
		const { username } = user;
		const users = await this.repository.getUsersPostgresByFriendStatus(username);
		res.send(users);
	}
	// fetchUserList.testName = 'hey'
	async registerAsGuest(req, res) {
		const { username, password } = req.body;
		console.log('Registering guest', username);
		const { success, error, ...user } = await this.repository
			.createGuest(username, password)
			.catch(e => {
				return { success: false, error: e };
			});
		if (!user || error) {
			res.send({ success, error });
			return;
		}
		const token = this.api.repositories.auth.initJWT(res, user);
		const publicUserData = this.repository.getPublicUser(user);
		res.send({ success: true, user: publicUserData });
	}
	// unused
	fetchOnlineUsers(req, res) {
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
}

module.exports = UserRoute;
