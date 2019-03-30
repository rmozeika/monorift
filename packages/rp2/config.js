var path = require('path');

var envFile = require('node-env-file');

var localConfPath = path.resolve(__dirname, process.env.CONFIG || 'local.conf');

// Load any undefined env vars from the local conf file.
// Does nothing if the file doesn't exist.
envFile(localConfPath, { raise: false });

var env = process.env;

exports.rootuser = env.rootuser;
exports.rootpassword = env.rootpassword;

exports.mongoConnectionString = env.mongoConnectionString;