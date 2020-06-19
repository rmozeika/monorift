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
const GraphqlService = require('./data-service/graphql-service');
console.log('VERSION', '0.6.2');
const { ApolloServer, gql } = require('apollo-server-express');

var app = express();

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
app.get('/groups', express.static(path.join(__dirname, 'public', 'groups')));

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
				: require('../../webpack.config.js');
		const buildpath = path.resolve(webpackConfig.output.path);
		app.get(['/about', '/admin'], (req, res, next) => {
			res.sendFile(path.resolve(buildpath, 'index.html'));
		});
		app.use(express.static(buildpath, opts));
	} else {
		console.log('Is remote');
		const opts = {};

		const buildpath = path.resolve(__dirname, './dist.web');
		app.get(['/about', '/admin'], (req, res, next) => {
			res.sendFile(path.resolve(buildpath, 'index.html'));
		});
		app.use(express.static(buildpath, opts));
	}
};
const setFurtherRoutes = async () => {
	const graphqlService = new GraphqlService(api);
	const gqlConfig = await graphqlService.createSchemas();
	// const server = new ApolloServer(userSchema.serverConfig);
	const server = new ApolloServer(gqlConfig);
	server.applyMiddleware({ app });
	app.use('/profile', express.static(path.join(__dirname, 'site')));

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
	console.log('api ready');
	setFurtherRoutes();
	console.log('App ready!');
});

app.api = api;
const socketIO = io();
app.io = socketIO;

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
	const { id } = await api.repositories.auth.userFromSocket(socket);
	const user = id ? await usersRepo.getUserById(id) : false;

	socket.on('check_auth', async ack => {
		if (user) {
			ack({ user });
			return;
		}
		ack({ user: false });
	});
});

module.exports = app;
