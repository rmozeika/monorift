var MongoUtil = require('./data-service/mongoUtil.js');
var routes = require('./routes/index.js');
var repositories = require('./repositories');
var config = require('./config.js');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

class Api {
	constructor() {
		this.repositories = {};
	}

	async init(app) {
		this.app = app;
		await this._connectMongo();
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
