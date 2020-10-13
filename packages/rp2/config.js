var path = require('path');

var envFile = require('node-env-file');

var localConfPath = path.resolve(__dirname, process.env.CONFIG || 'local.conf');

// Load any undefined env vars from the local conf file.
// Does nothing if the file doesn't exist.
envFile(localConfPath, { raise: false });

var env = process.env;
const { clientID, clientSecret, domain, callbackURL } = env;
exports.rootuser = env.rootuser;
exports.rootpassword = env.rootpassword;
exports.remote = env.remote || true;
exports.debug = env.debug || false;
exports.mongoConnectionString = env.mongoConnectionString;
exports.mongoUser = env.mongoUser;
exports.mongoPassword = env.mongoPassword;
exports.redisConnectionString = env.redisConnectionString;
exports.redisPort = env.redisPort || 6379;
exports.ADMIN_SECRET = env.ADMIN_SECRET;
exports.sessionSecret = env.sessionSecret;
exports.auth0Config = {
	clientID,
	clientSecret,
	domain,
	callbackURL
};
exports.psqlConfig = {
	user: env.psqlUser,
	password: env.psqlPassword,
	host: env.psqlHost || 'localhost',
	port: env.psqlPort || '5432'
};
exports.JWT_SECRET = env.JWT_SECRET;
exports.useSession = env.useSession || false;
exports.env = env;
