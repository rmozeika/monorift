const users = require('./users');
const friends = require('./friends');
const auth = require('./auth.js');
const groups = require('./groups/groups');
const members = require('./groups/members');
const code = require('./code.js');

module.exports = {
	users,
	friends,
	auth,
	groups,
	members,
	code
};
