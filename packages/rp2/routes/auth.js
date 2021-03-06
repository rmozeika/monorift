var express = require('express');
var router = express.Router();
const path = require('path');
var Route = require('./route.js');
const passport = require('../auth/auth0.js');

const routeName = '/auth';
const repoName = 'auth';
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

class AuthRoute extends Route {
	constructor(api) {
		super(api, routeName, repoName);
		const run = () => {
			this.router.get('/', (req, res) => {
				res.send('success');
			});
			this.router.get('/client', this.app.bind(this));
			this.router.get('/callback', this.auth0Callback.bind(this));
			this.router.get(
				'/login',
				passport.authenticate('auth0', { scope: 'openid email profile' }),
				function(req, res) {
					res.redirect('/auth');
				}
			);
			this.router.get('/logout', this.logout.bind(this));
			this.router.get('/callback', function(req, res, next) {
				passport.authenticate('auth0', function(err, user, info) {
					if (err) {
						return next(err);
					}
					if (!user) {
						return res.redirect('/login');
					}
					req.logIn(user, function(err) {
						if (err) {
							return next(err);
						}
						const returnTo = req.session.returnTo;
						delete req.session.returnTo;
						res.redirect(returnTo || '/users');
					});
				})(req, res, next);
			});
			this.router.get('/failed', this.failed.bind(this));
			this.router.post(
				'/simple/login',
				this.api.bruteforce.prevent,
				this.simpleLogin.bind(this)
			);
		};
		run();
	}
	app(req, res) {
		res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
	}
	async simpleLogin(req, res, next) {
		const { username, password } = req.body;
		const { error, user, publicUser } = await this.repository.simpleAuth(
			username,
			password
		);
		if (error || !user) {
			res.send({ error: error || 'Incorrect password' });
			return;
		}
		const token = await this.repository.initJWT(res, user);
		res.send({ success: true, user: publicUser });
	}
	auth0Callback(req, res, next) {
		passport.authenticate('auth0', async (err, user, info) => {
			// const auth = this.repository;
			// const token = auth.createJWT(user);
			// auth.saveJWTCookie(res, token);
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

	// Perform session logout and redirect to homepage
	logout(req, res) {
		res.clearCookie('token');
		req.logout();
		res.redirect('/');
	}

	failed(req, res) {
		console.log(req.body);
	}
}

module.exports = AuthRoute;
