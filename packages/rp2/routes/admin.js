var express = require('express');
var router = express.Router();
const path = require('path');
var Route = require('./route.js');

const routeName = '/admin';
const repoName = 'auth';
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

class AdminRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
		const run = () => {
			this.router.get(
				'/',
				this.api.repositories.auth.authenticateSuperUser,
				this.controlPanel.bind(this)
			);
		};
		run();
	}
	async controlPanel(req, res, next) {
		const { username, password } = req.body;
		const { error, ...user } = await this.repository.simpleAdmin(
			username,
			password
		);
		if (error || !user) {
			res.send({ error: error || 'Incorrect password' });
			return;
		}
		const token = await this.repository.initJWT(res, user);
		res.send({ success: true, user });
	}
	admin0Callback(req, res, next) {
		passport.adminenticate('admin0', async (err, user, info) => {
			// const admin = this.repository;
			// const token = admin.createJWT(user);
			// admin.saveJWTCookie(res, token);
			const token = await this.repository.initJWT(res, user);
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.redirect('/login');
			}
			const useSession = false;
			const returnTo = req.session.returnTo;

			if (!useSession) {
				res.redirect(returnTo || '/');
				return;
			}
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				delete req.session.returnTo;
				res.redirect(returnTo || '/');
			});
		})(req, res, next);
	}
}

module.exports = AdminRoute;
