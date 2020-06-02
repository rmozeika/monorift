var express = require('express');
var router = express.Router();
const authenticateSession = require('../middleware/session-secured');
const { authenticateToken } = require('../middleware/jwt');
const { useSession } = require('../config');

var Route = require('./route.js');

const routeName = '/friends';
const repoName = 'friends';
const util = require('util');

const authenticate = !useSession ? authenticateToken : authenticateSession;
class UserRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
	}

	addFriendRoute = this.route`post/add${this.addFriend}${authenticate}`;
	acceptFriendRoute = this.route`post/accept${this.acceptFriend}${authenticate}`;
	rejectFriendRoute = this.route`post/reject${this.rejectFriend}${authenticate}`;
	getFriendsRoute = this.route`post/${this.fetchFriends}${authenticate}`;

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

	// unused
	async fetchFriends(req, res) {
		const { username } = this.getUserFromReq(req);

		const friends = await this.repository.getFriendsForUser(username);
		res.send(friends);
	}
}

module.exports = UserRoute;
