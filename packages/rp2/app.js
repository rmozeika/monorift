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
// const rift = require('rift');
const webpackConfig = require('../../webpack.config.js');
// const middleware = require('webpack-dev-middleware');
const webpack = require('webpack');

// const compiler = webpack(webpackConfig);

var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/data',
  collection: 'mySessions'
});

var app = express();
app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  // Boilerplate options, see:
  // * https://www.npmjs.com/package/express-session#resave
  // * https://www.npmjs.com/package/express-session#saveuninitialized
  resave: true,
  saveUninitialized: true
}));
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
app.use('/', express.static(path.join(webpackConfig.output.path)));
app.get('*', (req, res) => {
    res.send('index.html', { root: path.resolve(webpackConfig.output.path) });
});
console.log('App ready!');

app.api = api;
module.exports = app;



