var path = require('path');

var envFile = require('node-env-file');

var localConfPath = path.resolve(__dirname, process.env.CONFIG || 'local.conf');

// Load any undefined env vars from the local conf file.
// Does nothing if the file doesn't exist.
envFile(localConfPath, { raise: false });

var env = process.env;

exports.secret = env.secret;
exports.branch = env.branch;
exports.env = env;
