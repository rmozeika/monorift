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
	}
	retrieveAllRoute = this.route`get/${this.retrieveAll}${authenticate}`;
	retrieveAllRoutePost = this.route`post/${this.retrieveAll}${authenticate}`;
	fetchUserListRoute = this.route`get/all${this.fetchUserList}`;
	fetchUserListRoutePost = this.route`post/all${this.fetchUserList}`;
	// change this on frontend
	createUserRoute = this
		.route`post/create/user${this.createUser}${authenticate}`;
	fetchOnlineRoute = this
		.route`post/online${this.fetchOnlineUsers}${authenticate}`;
	getUserRoute = this.route`get/username${this.getUser}${authenticate}`;
	updateTempUsernameRoute = this
		.route`post/username/temp${this.updateTempUsername}${authenticate}`;
	registerAsGuestRoute = this
		.route`post/guest/register${this.registerAsGuest}${this.api.bruteforce.prevent}`;
	getUserByIdRoute = this.route`get/id${this.getUserById}${authenticate}`;

	async getUserById(req, res) {
		const { query } = req;
		const { id } = query;
		const idNum = Number(id);
		const user = await this.repository.query({ id: idNum });
		res.send(user);
	}

	retrieveAll(req, res) {
		const users = this.repository
			.findAll()
			.then(() => {
				res.send(users);
			})
			.catch(e => {
				res.error(e);
			});
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
		const user = this.getUserFromReq(req);
		const { username } = user;
		const users = await this.repository.getUsersPostgresByFriendStatus(username);
		res.send(users);
	}
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

	async updateTempUsername(req, res) {
		const user = this.getUserFromReq(req);
		const { username: tempUsername } = user;
		const { username } = req.body;
		const result = await this.repository
			.updateTempUsername(tempUsername, username)
			.catch(e => {
				console.error(e);
			});
		if (result.succes === false) {
			return res.send(result);
		}
		const updatedUser = await this.repository.findById(user.oauth_id);
		const token = this.api.repositories.auth.initJWT(res, updatedUser);
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
