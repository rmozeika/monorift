const Command = require('./Command.js');
const repositoryName = 'users';
const mockUsers = require('./mock-data/mock-users.js');
class UserCommands extends Command {
	constructor(rp2) {
		super(rp2, repositoryName);
		this.createMockUsers = this.createMockUsers.bind(this);
		this.addFriend = this.addFriend.bind(this);
		this.acceptFriend = this.acceptFriend.bind(this);
		this.addAllMockToFriends = this.addAllMockToFriends.bind(this);
	}
	async createMockUsers() {
		// mockUsers.forEach(user => {
		//     this.repository.importProfile(user)
		// });
		const promises = mockUsers.map(user => {
			return this.repository.importProfile({ ...user, mocked: true });
		});
		let res;
		await Promise.all(promises)
			.then(result => {
				console.log(result);
				res = result;
			})
			.catch(e => {
				console.log(e);
			});
		return res;
	}
	acceptFriend() {
		return this.repository.acceptFriend(
			'robertmozeika',
			'santaclauseoldsaintnick'
		);
	}
	addFriend() {
		return this.repository.addFriend('robertmozeika', 'santaclauseoldsaintnick');
	}
	async addAllMockToFriends(username = 'robertmozeika') {
		const promises = mockUsers.map(mockUser => {
			return this.repository.addFriend(username, mockUser.username, true);
		});
		let res;
		await Promise.all(promises)
			.then(result => {
				console.log(result);
				res = result;
			})
			.catch(e => {
				console.log(e);
			});
		return res;
	}
	getFriends() {
		return this.repository.getFriendsForUser('robertmozeika');
	}
}
module.exports = UserCommands;
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
