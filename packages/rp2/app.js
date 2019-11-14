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
const uri = require('./config.js').mongoConnectionString;

// const webpackConfig = require('../../webpack.config.js');
// const distWeb = require('./dist.web');
const webpack = require('webpack');
var io = require('socket.io');
const passportSocketIo = require('passport.socketio');
 
// const compiler = webpack(webpackConfig);

var store = new MongoDBStore({
  uri,
  collection: 'mySessions'
});

var app = express();
const sessionMiddleware = require('express-session')({
  secret: 'This is a secret',
  key: 'express.sid',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
});

app.use(sessionMiddleware);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// app.use(session({
//     secret: 'shhhhhhhhh',
//     resave: true,
//     saveUninitialized: true
//   }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(express.static(path.join(__dirname, '/client/build')));

var api = require('./api.js');
// app.use(middleware(compiler, {
//   publicPath: webpackConfig.output.publicPath
// }));
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

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// }.bind(this));

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   console.log(err)
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.use('/', express.static(path.resolve('./dist.web')));
// app.get('*', (req, res) => {
//     res.send('index.html', { root: path.resolve(webpackConfig.output.path) });
// });
console.log('App ready!');

app.api = api;
const socketIO = io();
app.io = socketIO;
// app.io.use(passportSocketIo.authorize({
//   cookieParser: cookieParser,       // the same middleware you registrer in express
//   key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
//   secret:       'This is a secret',    // the session_secret to parse the cookie
//   store:        store,        // we NEED to use a sessionstore. no memorystore please
//   success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
//   fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
// }));
app.io.use(function(socket, next){
  // Wrap the express middleware
  sessionMiddleware(socket.request, {}, next);
});
function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
 
  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
 
  // // OR
 
  // // If you use socket.io@1.X the callback looks different
  // accept();
}
function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
 
  // We use this callback to log all of our failed connections.
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
  // my msg
});

module.exports = app;



