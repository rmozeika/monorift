const express = require('express');
var config = require('../config.js');

class Route {
	constructor(api, routeName, repoName) {
		this.api = api;
		this.routeName = routeName;
		this.router = express.Router();
		if (repoName) {
			this.repository = api.repositories[repoName];
		}
		// extends methods, add config for this
		if (false) {
			setImmediate(() => {
				this.repository.getExtendedMethodNames().forEach(method => {
					const route = this.makeRoute(method);
					this.router.post(`/${method}`, route.bind(this));
				});
			});
		}
	}

	makeRoute(method) {
		return (req, res) => {
			const util = require('util');
			console.log(
				`
#Start Request#

${util.inspect(req.user, false, null)}
`
			);

			//Only system admin has access to mongodb methods
			if (req.user && req.user.privledges === 'sysadmin') {
				const query = req.body;
				this.repository[method](query, (err, data) => {
					if (err) throw err;
					console.log(
						`
#End Request#
`
					);
					res.send(data);
				});
			} else {
				// res.redirect('/login');
				res.send('No sysadmin privledges');
			}
		};
	}

	checkPermission({ req, res }, privledges) {
		if (!Array.isArray(privledges)) {
			privledges = [privledges];
		}
		const user = req.user;
		if (user && user.privledges) {
			return privledges.some(privledge => {
				return privledge === user.privledges;
			});
		}
		res.send('Permission denied');
		return false;
	}

	getRouter() {
		return this.router;
	}
}

module.exports = Route;
