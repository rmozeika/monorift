const session = require('express-session');
let RedisStore = require('connect-redis')(session);
const passport = require('../auth/auth0');

const redis = require('redis');
const {
	redisConnectionString,
	redisPort = 6379,
	sessionSecret,
	useSession
} = require('../config');

let client = redis.createClient(redisPort, redisConnectionString);

module.exports = function(app) {
	app.use(passport.initialize());

	app.use(passport.session());
	app.use(function(req, res, next) {
		const user =
			req.session &&
			req.session.passport &&
			req.session.passport.user &&
			req.session.passport.user.username;
		// console.log(user || 'anonymous', req.path);
		console.log(`
			Request: ${req.method} ${req.path}
			User:  ${user || 'anonymous'}
		`);
		console.log('Time:', Date.now());
		next();
	});

	const sessionMiddleware = session({
		store: new RedisStore({ client }),
		secret: sessionSecret,
		resave: false
	});

	app.use(sessionMiddleware);

	if (useSession) {
		app.io.use(function(socket, next) {
			sessionMiddleware(socket.request, {}, next);
		});
	}

	const userFromSocketConnection = socket => {
		const { session = {} } = socket.request;
		const { passport = {} } = session;
		const { user = false } = passport;
		return user;
	};
};
