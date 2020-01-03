var express = require('express');
var router = express.Router();
const secured = require('../middleware/secured');
var Route = require('./route.js');

const routeName = '/users';
const repoName = 'users';

class UserRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
		setImmediate(() => {
			this.router.get('/', secured(), this.retrieveAll.bind(this));
			this.router.post('/', secured(), this.retrieveAll.bind(this));
			this.router.post('/createUser', secured(), this.createUser.bind(this));
			this.router.get('/username', secured(), this.getUser.bind(this));
		});
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
}

module.exports = UserRoute;
