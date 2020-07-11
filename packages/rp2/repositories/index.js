const users = require('./users');
const friends = require('./friends');
const auth = require('./auth.js');
const groups = require('./groups/groups');
const members = require('./groups/members');
const messages = require('./messages/messages');
const conversations = require('./messages/conversations');
const images = require('./images');
const code = require('./code.js');

module.exports = {
	images,
	users,
	friends,
	auth,
	members,
	groups,
	messages,
	conversations,
	code
};
