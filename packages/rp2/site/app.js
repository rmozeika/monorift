const express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const redis = require('redis');
const siteData = require('robertmozeika-site');
var app = express();

const publicDir = siteData();
// app.use(sessionMiddleware);

// app.use(favicon(path.join(__dirname, 'rmPublic', 'favicon.ico')));
// app.use('files', express.static(path.join(__dirname, 'public')));
// let buildpath;
// app.use(express.static(buildpath, opts));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function(req, res, next) {
	console.log('Time:', Date.now());
	next();
});

app.use(express.static(publicDir));

app.use(function(req, res, next) {
	console.log('Time:', Date.now());
	console.log(req);
	next();
});

app.use('/', (req, res) => {
	res.sendFile(path.join(publicDir, 'index.html'));
});
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(err);
	res.status(err.status || 500);
	res.send('error');
});

console.log('App ready!');

module.exports = app;
