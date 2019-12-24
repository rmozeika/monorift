var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
const passport = require('./auth0');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const config = require('./config.js');
const { mongoConnectionString: uri, remote, sessionSecret } = config;
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
const sessionMiddleware = require('express-session')({
  secret: sessionSecret,
  key: 'express.sid',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: store,
  resave: true,
  saveUninitialized: true
});

app.use(sessionMiddleware);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

var api = require('./api.js');

api.init(app).then(() => {
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

if (remote == 'false') {
  const webpackConfig = require('../../webpack.config.js');
  app.use('/', express.static(path.resolve(webpackConfig.output.path)));

} else {
  app.use('/', express.static(path.resolve('./dist.web')));
}
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}.bind(this));

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err)
  res.status(err.status || 500);
  res.send('error');
});

console.log('App ready!');

app.api = api;
const socketIO = io();
app.io = socketIO;

app.io.use(function(socket, next){
  sessionMiddleware(socket.request, {}, next);
});
function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');

  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
 
  accept(null, false);
}
app.io.on('connection', (socket) => {
  const { session = {} } = socket.request;
  const { passport = {} } = session;
  const { user = false } = passport;

  socket.on('check_auth', (ack) => {
    if (user) {
      ack(user);
      return;
    }
    ack({ user: false });
  });

});
app.io.on('message', function (msg) {
  console.log(msg);
});
const call = new Call(app.io);
module.exports = app;