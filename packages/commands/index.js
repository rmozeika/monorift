const rp2 = require('../rp2/api.js');

rp2
	.init({})
	.then(() => {
		console.log(rp2);

		acceptFriend()
			.then(user => {
				console.log(user);
			})
			.catch(e => {
				console.log(e);
			});
	})

	.catch(e => {
		console.log(e);
	});
const acceptFriend = () => {
	return rp2.repositories.users.acceptFriend(
		'robertmozeika',
		'santaclauseoldsaintnick'
	);
};
const addFriend = () => {
	return rp2.repositories.users.addFriend(
		'robertmozeika',
		'santaclauseoldsaintnick'
	);
};
const getFriends = () => {
	return rp2.repositories.users.getFriendsForUser('robertmozeika');
};
