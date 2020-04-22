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
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}
// const verify = asyc (token) => {
//     const verified = jwt.
// }

module.exports = { authenticateToken, userFromToken };
