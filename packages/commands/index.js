const rp2 = require('../rp2/api.js');

rp2
	.init({})
	.then(() => {
		console.log(rp2);
		// rp2.repositories.users.createUser({
		//     username: 'newdude',
		//     email: 'newdude@gmail.com',
		//     src: {},
		//     socket_id: null

		// })
		//rp2.repositories.users.addFriend('robertmozeika', 'santaclauseoldsaintnick')
		rp2.repositories.users
			.getFriendsForUser('robertmozeika')
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
