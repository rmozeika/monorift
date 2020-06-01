var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
const passport = require('./auth/auth0');
const redis = require('redis');
const jwtMiddleware = require('./middleware/jwt');
const appSession = require('./middleware/session');
const config = require('./config.js');
const { mongoConnectionString: uri, remote, debug } = config;
const fs = require('fs');
const webpack = require('webpack');
var io = require('socket.io');
const passportSocketIo = require('passport.socketio');
const Socket = require('./socket');
const CallSocket = require('./socket/call');
const UsersSocket = require('./socket/users');
const graphqlHTTP = require('express-graphql');
const Schema = require('./data-service/data-model/users/graphql.schema.js');
console.log('VERSION', '0.5.3');
const { ApolloServer, gql } = require('apollo-server-express');

var app = express();
// probably remove as this is already created in api.js
// let client = redis.createClient(redisPort, redisConnectionString);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.get(
	'/gravatar',
	express.static(path.join(__dirname, 'public', 'gravatar'))
);

app.use(express.static(path.join(__dirname, 'public')));

var api = require('./api.js');
const setupDefaultRoute = () => {
	if (remote == 'false') {
		console.log('Not remote');
		const opts = {};
		if (debug) {
			opts.maxAge = 5;
		}

		const webpackConfig =
			debug == 'false'
				? require('../../webpack.config.prod.js')
				: // : require('../../webpack.config.prod.js');
				  require('../../webpack.config.js');
		const buildpath = path.resolve(webpackConfig.output.path);
		app.get(['/about', '/admin'], (req, res, next) => {
			res.sendFile(path.resolve(buildpath, 'index.html'));
		});
		app.use(express.static(buildpath, opts));
		// app.use('*', express.static(path.resolve(webpackConfig.output.path)));
		// app.use('*', express.static(path.resolve(webpackConfig.output.path)));
	} else {
		console.log('Is remote');
		const opts = {};

		const buildpath = path.resolve(__dirname, './dist.web');
		// app.use(express.static(__dirname + './dist.web'));
		// app.use('*', express.static(path.resolve(__dirname, './dist.web')));
		app.get(['/about', '/admin'], (req, res, next) => {
			res.sendFile(path.resolve(buildpath, 'index.html'));
		});
		app.use(express.static(buildpath, opts));
	}
};
const setFurtherRoutes = () => {
	const userSchema = new Schema(api);
	const server = new ApolloServer(userSchema.serverConfig);
	server.applyMiddleware({ app });

	// app.use(
	// 	'/graphql',
	// 	graphqlHTTP({
	// 		schema: userSchema.Schema,
	// 		// rootValue: root,
	// 		graphiql: true
	// 	})
	// );
	app.use(
		function(req, res, next) {
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}.bind(this)
	);
	app.use('/', (req, res) => {
		res.send('root');
	});
	app.use(function(err, req, res, next) {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		console.error(err);
		res.status(err.status || 500);
		res.send('error');
	});

	const callSocket = new CallSocket(app.io, api);
	const usersSocket = new UsersSocket(app.io, api);
};

setupDefaultRoute();
appSession(app);
app.use(jwtMiddleware.userFromToken);
api.init(app).then(() => {
	setFurtherRoutes();
	console.log('api ready');
});
// exports.api = api;
app.use('/profile', express.static(path.join(__dirname, 'site')));

let buildpath;

console.log('App ready!');
app.api = api;
const socketIO = io();
app.io = socketIO;
// api.redis = client;
// api.redis = client;

function onAuthorizeSuccess(data, accept) {
	console.log('successful connection to socket.io');

	accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
	if (error) throw new Error(message);
	console.log('failed connection to socket.io:', message);

	accept(null, false);
}
app.io.on('connection', async socket => {
	const usersRepo = api.repositories.users;
	const { oauth_id } = await api.repositories.auth.userFromSocket(socket);
	const userData = oauth_id ? await usersRepo.findById(oauth_id) : false;
	const user = usersRepo.getPublicUser(userData);
	// 	if (isUser) {
	// 		const key = client.sadd('online_users', user.oauth_id);
	// 		client.setbit('online_bit', user.bit_id, 1);
	// 		client.set(user.oauth_id, socket.id);
	// 		client.hmset(`user:${user.username}`, [
	// 			'socketid',
	// 			socket.id,
	// 			'key',
	// 			user.oauth_id
	// 		]);
	// 	}
	// 	app.api.repositories.users
	// 		.updateByUsername(user.username, { socket_id: socket.id })
	// 		.then(result => {
	// 			console.log(result);
	// 		});
	socket.on('check_auth', async ack => {
		if (user) {
			// const token = jwt.sign(user, JWT_SECRET);
			ack({ user });
			return;
		}
		// const token = jwt.sign(session, JWT_SECRET);
		ack({ user: false });
		// ack({ user: false, token });
	});
	// 	socket.on('disconnect', socket => {
	// 		// client.setbit('online_bit', user.bit_id, 1);

	// 		console.log('disconnected');
	// 		if (user.username) {
	// 			client.srem('online_users', user.oauth_id);
	// 		}
	// 	});
});
// app.io.on('disconnect', async socket => {
// 	console.log('disconnected');
// });

// app.io.on('message', function(msg) {
// 	// console.log(msg);
// });

module.exports = app;
