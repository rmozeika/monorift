const users = require('./users');
const friends = require('./friends');
const auth = require('./auth.js');
const groups = require('./groups/groups');
const members = require('./groups/members');
const images = require('./images');
const code = require('./code.js');

module.exports = {
	images,
	users,
	friends,
	auth,
	members,
	groups,

	code
};
