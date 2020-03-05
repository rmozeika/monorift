const acceptFriend = () => {
	return rp2.repositories.users.acceptFriend(
		'robertmozeika',
		'santaclauseoldsaintnick'
	);
};
exports.acceptFriend = acceptFriend;

const addFriend = () => {
	return rp2.repositories.users.addFriend(
		'robertmozeika',
		'santaclauseoldsaintnick'
	);
};
exports.addFriend = addFriend;

const getFriends = () => {
	return rp2.repositories.users.getFriendsForUser('robertmozeika');
};
exports.getFriends = getFriends;
// module.exports = { accept, addFriend, getFriends };
