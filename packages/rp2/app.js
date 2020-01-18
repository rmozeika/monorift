var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
const passport = require('./auth0');
const redis = require('redis');

const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const config = require('./config.js');
const {
	mongoConnectionString: uri,
	remote,
	sessionSecret,
	debug,
	redisConnectionString
} = config;
const fs = require('fs');
const webpack = require('webpack');
var io = require('socket.io');
const passportSocketIo = require('passport.socketio');
const Socket = require('./socket');
const Call = require('./socket/call');
var store = new MongoDBStore({
	uri,
	collection: 'mySessions'
});
console.log('CHCK DEBUG', debug);
// LOGGING
// var logStream = fs.createWriteStream('./app.log', {flags: 'a'});

// var spawn = require('child_process').spawn,
//     ls    = spawn('ls', ['-lh', '/usr']);

// ls.stdout.pipe(logStream);
// ls.stderr.pipe(logStream);

// ls.on('close', function (code) {
//   console.log('child process exited with code ' + code);
// });
var app = express();
// const sessionMiddleware = require('express-session')({
// 	secret: sessionSecret,
// 	key: 'express.sid',
// 	cookie: {
// 		maxAge: 1000 * 60 * 60 * 24 * 7
// 	},
// 	store: store,
// 	resave: true,
// 	saveUninitialized: true
// });
let RedisStore = require('connect-redis')(session);
let client = redis.createClient(6379, redisConnectionString);

const sessionMiddleware = session({
	store: new RedisStore({ client }),
	secret: 'keyboard cat',
	resave: false
});

app.use(sessionMiddleware);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use('files', express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	if (req.path.indexOf('.mp3') > -1) {
		console.log(req);
	}
	console.log('Time:', Date.now());
	next();
});
app.get('/test', (req, res, next) => {
	res.sendFile(path.join(__dirname, 'public', 'example.mp3'));
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	console.log('Time:', Date.now());
	if (req.path.indexOf('.mp3') > -1) {
		console.log(req);
	}
	next();
});
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
		app.use(express.static(buildpath, opts));
		//  builpath = path.resolve(__dirname + '/../../+ webpackConfig.output.path);
		// buildpath = path.resolve(webpackConfig.output.path);
		// app.use(express.static(buildpath));
		// app.use(express.static(path.resolve(process.cwd() +'/dist.web/')));
		// app.get('*', (req, res) => {
		//   //res.
		//   const indexPath = path.resolve(process.cwd() +'/dist.web/index.html' );
		//   res.sendFile(indexPath);
		// });
		// app.use(express.static(path.resolve(webpackConfig.output.path)))
		app.use('*', express.static(path.resolve(webpackConfig.output.path)));
		// app.use('/tiffany', express.static(path.resolve(webpackConfig.output.path)));
	} else {
		console.log('Is remote');

		// app.use('*', express.static(path.resolve('./dist.web')));
		builpath = path.resolve(__dirname, './dist.web');
		app.use(express.static(__dirname + './dist.web'));
		app.use('*', express.static(path.resolve(__dirname, './dist.web')));
	}
};
const setFurtherRoutes = () => {
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
		console.log(err);
		res.status(err.status || 500);
		res.send('error');
	});
};
api.init(app).then(() => {
	setupDefaultRoute();
	setFurtherRoutes();
	console.log('api ready');
});
app.use('/profile', express.static(path.join(__dirname, 'site')));
// app.use('/rift', express.static(path.join(__dirname, 'client')));

// app.get('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
//     res.send(true);
// });

// app.post('/logout', (req, res) => {
//   req.session.destroy(function (err) {
//     res.redirect('/users');
//   });
// })

let buildpath;
// if (false) {

console.log('App ready!');
app.api = api;
const socketIO = io();
app.io = socketIO;
api.redis = client;
app.io.use(function(socket, next) {
	sessionMiddleware(socket.request, {}, next);
});
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
	const { session = {} } = socket.request;
	const { passport = {} } = session;
	const { user = false } = passport;
	// app.api.repositories.users.mongoInstance.updateOne(
	// 	{ $set: { username: user.username} },
	// 	{ socket_id: socket.id })
	// 	.then(result => {
	// 		console.log(result);
	// 	}).catch(e => {
	// 		console.log(e);
	// 	});
	if (user && user.username) {
		client.sadd('online_users', user.username);
		client.set(user.username, socket.id);
	}
	app.api.repositories.users
		.updateByUsername(user.username, { socket_id: socket.id })
		.then(result => {
			console.log(result);
		});
	socket.on('check_auth', ack => {
		if (user) {
			ack(user);
			return;
		}
		ack({ user: false });
	});
	// app.io.sockets.socket(socket.id).emit('recorded your socket id');
});
app.io.on('message', function(msg) {
	console.log(msg);
});
const call = new Call(app.io, api);
module.exports = app;
