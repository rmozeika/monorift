var express = require('express');
var router = express.Router();
const secured = require('../middleware/secured');
var Route = require('./route.js');

const routeName = '/code';
const repoName = 'code';

class CodeRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
		setImmediate(() => {
			this.router.post('/', this.clone.bind(this));
			this.router.get('/repo', this.repo.bind(this));
		});
	}

	clone(req, res) {
		const { repo } = req.data;
		this.repository.clone(repo);
	}
	repo(req, res) {}
}

module.exports = CodeRoute;
