var MongoUtil = require('./data-service/mongoUtil.js');
var PostgreUtil = require('./data-service/postgresUtil.js');

var routes = require('./routes/index.js');
var repositories = require('./repositories');
var config = require('./config.js');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { redisConnectionString, redisPort } = require('./config.js');
const redis = require('redis');
const { promisify } = require('util');
class Api {
	constructor() {
		this.repositories = {};
	}

	async init(app) {
		this.app = app;
		await this._connectMongo();
		await this._connectPostgres();
		await this._connectRedis();
		this._registerRoutes();
		// this._createRootUser();
	}

	_connectMongo() {
		return new Promise((resolve, reject) => {
			this.mongoInstance = new MongoUtil();
			this.mongoInstance.connectToServer((err, db) => {
				if (err) reject(err);
				this._createRootUser.bind(this);
				return resolve();
			});
		});
	}
	async _connectPostgres() {
		// return new Promise((resolve, reject) => {
		this.postgresInstance = new PostgreUtil();
		await this.postgresInstance.connectToServer();
		// });
	}
	async _connectRedis() {
		let client = redis.createClient(redisPort, redisConnectionString);
		this.redis = client;
	}
	async redisAsync(cmd, ...args) {
		const func = this.redis[cmd];
		const redisPromise = promisify(func);
		const result = await redisPromise.apply(this.redis, args);
		return result;
	}
	_registerRoutes() {
		this._createRepositories();

		Object.keys(routes).forEach(route => {
			if (!this.app.use) return;
			var Route = routes[route];
			var newRoute = new Route(this);
			this.app.use(newRoute.routeName, newRoute.getRouter());
		});
	}

	_createRepositories() {
		Object.keys(repositories).forEach(repo => {
			var Repository = repositories[repo];
			var newRepo = new Repository(this);
			this.repositories[repo] = newRepo;
		});
	}

	async _createRootUser() {
		var rootUser = {
			username: config.rootuser,
			password: config.rootpassword,
			privledges: 'sysadmin'
		};
		this.repositories.users.findByUsername(rootUser.username, (err, user) => {
			if (!user) {
				this.repositories.users.createUser(rootUser, (err, res) => {
					console.log('created new root user: ' + rootUser.username);
					return;
				});
			}
		});
	}
}

const api = new Api();
module.exports = api;
