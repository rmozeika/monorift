const rp2 = require('../rp2/api.js');
const { getFriends, acceptFriend, addFriend } = require('./users');
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
