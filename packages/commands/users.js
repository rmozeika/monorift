const Command = require('./Command.js');
const repositoryName = 'users';
const mockUsers = require('./mock-data/mock-users.js');
const path = require('path');
// const data = require('./mock-data/mock.json')
var fs = require('fs');
const { promisify } = require('util');
class UserCommands extends Command {
	constructor(rp2) {
		super(rp2, repositoryName);
		this.createMockUsers = this.createMockUsers.bind(this);
		this.addFriend = this.addFriend.bind(this);
		this.acceptFriend = this.acceptFriend.bind(this);
		this.addAllMockToFriends = this.addAllMockToFriends.bind(this);
		this.createGravatar = this.createGravatar.bind(this);
		this.deleteAll = this.deleteAll.bind(this);
	}
	async createMockUsers() {
		// mockUsers.forEach(user => {
		//     this.repository.importProfile(user)
		// });
		// const users = JSON.parse(data);
		const jsonPath = path.resolve(__dirname, 'mock-data', 'mock.json');
		var users = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

		const promises = users.map(user => {
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
	createGravatar(username, email) {
		return this.repository.createGravatar(username, email);
	}
	async deleteAll() {
		const mongo = await this.repository.deleteMany({});
		const friends = await this.repository.postgresInstance
			.knex('friendship')
			.del();
		const postgres = await this.repository.postgresInstance.knex('users').del();
		const redis = await this.repository.api.redisAsync('flushdb');
		return { mongo, postgres, redis };
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
