var express = require('express');
var router = express.Router();
const path = require('path')
var Route = require('./route.js');
const passport = require('../auth0.js')

const routeName = '/';
const repoName = 'users';
const ensureLoggedIn = require("connect-ensure-login").ensureLoggedIn();;

class AuthRoute extends Route {
    constructor(api) {
        super(api, routeName, repoName);
        const run = () => {
            this.router.get('/client', this.app.bind(this));
            this.router.get('/callback', this.auth0Callback.bind(this));
            this.router.get('/login',
                passport.authenticate('auth0', {scope: 'openid email profile'}), function (req, res) {
                res.redirect("/");
            });
            this.router.get('/logout');
            this.router.get('/callback', function (req, res, next) {
              passport.authenticate('auth0', function (err, user, info) {
                if (err) { return next(err); }
                if (!user) { return res.redirect('/login'); }
                req.logIn(user, function (err) {
                  if (err) { return next(err); }
                  const returnTo = req.session.returnTo;
                  delete req.session.returnTo;
                  res.redirect(returnTo || '/user');
                });
              })(req, res, next);
            });
            this.router.get('/failed', this.failed.bind(this));
        }
        run();
    }
    app(req, res) {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    }

    auth0Callback(req, res, next) {
      passport.authenticate('auth0', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function (err) {
          if (err) { return next(err); }
          const returnTo = req.session.returnTo;
          delete req.session.returnTo;
          res.redirect(returnTo || '/');
        });
      })(req, res, next);   
    }
     
      // Perform session logout and redirect to homepage
      logout(req, res) {
        req.logout();
        res.redirect('/');
      };

      failed(req, res) {
        console.log(req.body);
      }
}

module.exports = AuthRoute;
