const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config.js');

function authenticateToken(req, res, next) {
	// const authHeader = req.headers['authorization'];
	// const token = authHeader && authHeader.split(' ')[1];
	const token = req.cookies.token;
	if (token == null) return res.sendStatus(401);
	// if (token == null) {
	//     next();
	//     return
	// }
	jwt.verify(token, JWT_SECRET, (err, user) => {
		console.log(err);
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}
function userFromToken(req, res, next) {
	// const authHeader = req.headers['authorization'];
	// const token = authHeader && authHeader.split(' ')[1];
	const token = req.cookies.token;
	// if (token == null) return res.sendStatus(401);
	if (token == null) {
		next();
		return;
	}
	jwt.verify(token, JWT_SECRET, (err, user) => {
		console.log(err);
		if (err) {
			res.clearCookie('token');
			return res.sendStatus(403);
		}
		// if (err)
		req.user = user;
		next();
	});
}
// const verify = asyc (token) => {
//     const verified = jwt.
// }
function authenticateSuperUser(req, res, next) {
	const token = req.cookies.token;
	if (token == null) return res.sendStatus(401);
	jwt.verify(token, JWT_SECRET, (err, user) => {
		console.log(err);
		if (err) return res.sendStatus(403);
		req.user = user;
		if (!req.user) return res.send(403);
		if (req.user.admin !== true) return res.send(403);
		next();
	});
}
module.exports = { authenticateToken, userFromToken, authenticateSuperUser };
