const Auth0Strategy = require('passport-auth0'),
	passport = require('passport');

const { auth0Config } = require('./config.js');
const api = require('./api.js');
const { clientID, clientSecret, domain, callbackURL } = auth0Config;
//passport-auth0
const strategy = new Auth0Strategy(
	{
		domain,
		clientID,
		clientSecret,
		callbackURL
	},
	function(accessToken, refreshToken, extraParams, profile, done) {
		// accessToken is the token to call Auth0 API (not needed in the most cases)
		// extraParams.id_token has the JSON Web Token
		// profile has all the information from the user
		const users = api.repositories['users'];
		users.findOne({ username: profile.nickname }).then(user => {
			if (!user) {
				users.importProfile(profile).then(res => {
					return done(null, profile);
				});
				//return done(null, profile)
			} else {
				return done(null, profile);
			}
		});
	}
);

passport.use(strategy);

//app.js
passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

module.exports = passport;
