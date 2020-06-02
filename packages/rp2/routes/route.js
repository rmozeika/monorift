const express = require('express');
var config = require('../config.js');
const { useSession } = require('../config');

class Route {
	constructor(api, routeName, repoName) {
		this.api = api;
		this.routeName = routeName;
		this.router = express.Router();
		if (repoName) {
			this.repository = api.repositories[repoName];
		}
		this.makeRoutesNew();
		if (this.constructor.routeTypes) {
			this.makeRoutesNew();
			// const  rese = this.publicStaticMethod();
			// const privvy = this.constructor.staticNewField;
			// console.log(rese, privvy);
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
	route([route], handler, ...restMiddleware) {
		// const [ prefix, routePath = '/' ] = route[0].split('/');
		const [full, requestType, routePath] = /(post|get|put)?(\/.*)/.exec(route);
		// const boundHandler = handler.bind(this);
		this.router[requestType].apply(this.router, [
			routePath,
			...restMiddleware,
			handler.bind(this)
		]);
		// console.log([...args]);
		return [routePath];
	}
	makeRoutesNew() {
		if (!this.routeTypes) return;

		const routeTypes = this.routeTypes;
		// const protectRoutes = this.protectRoutes;

		if (routeTypes) {
			Object.entries(routeTypes).forEach(
				([route, [requestType = 'post', handler, ...restMiddleware]]) => {
					const routeBind = handler.bind(this);
					const handlerWithMiddleware = [route, ...restMiddleware, routeBind];
					// const middleware = protectRoutes[route];
					this.router[requestType].apply(this.router, handlerWithMiddleware);
				}
			);
		}
		// const other = this.routeTypes2;
		// const  rese = this.publicStaticMethod();
		// const privvy = this.staticNewField;
		// console.log(rese, privvy);
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

	getUserFromReq(req) {
		if (!useSession) {
			const { user = {} } = req;
			return user;
		} else {
			const { user = {} } = req.session && req.session.passport;
			return user;
		}
	}
}

module.exports = Route;
