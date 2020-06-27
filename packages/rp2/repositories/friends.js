const Repository = require('./repository.js');
// friendship status
// A = accepted
// S = SENT
// P = PENDING
const friendStatus = {
	accepted: 'A',
	sent: 'S',
	pending: 'P',
	rejected: 'R'
};
class FriendsRepository extends Repository {
	constructor(api) {
		super(api);
	}
	static getNamespaces() {
		return {
			collection: null,
			table: 'friendship'
		};
	}
	async getFriends(query = {}, select = '*') {
		return await this.postgresInstance
			.knex('friendship')
			.where(query)
			.select(select);
	}
	async acceptFriend(username, friendUsername) {
		const [
			user,
			friend
		] = await this.api.repositories.users.getUserColumnsByUsername(
			[username, friendUsername],
			['oauth_id', 'id'] // do not need oauth_id
		);
		const accepted = await this.postgresInstance
			.knex('friendship')
			.update('status', friendStatus.accepted)
			.where({ member1_id: user.id, member2_id: friend.id })
			.orWhere({ member1_id: friend.id, member2_id: user.id });
		const updateToFriend = await this.publishFriendStatus(
			friendStatus.accepted,
			friend,
			user
		);
		const updateToSelf = await this.publishFriendStatus(
			friendStatus.accepted,
			user,
			friend
		);

		return accepted;
	}

	async rejectFriend(username, friendUsername) {
		const [
			user,
			friend
		] = await this.api.repositories.users.getUserColumnsByUsername(
			[username, friendUsername],
			['oauth_id', 'id']
		);
		const reject = await this.postgresInstance
			.knex('friendship')
			.update('status', friendStatus.rejected)
			.where({ member1_id: user.id, member2_id: friend.id })
			.orWhere({ member1_id: friend.id, member2_id: user.id });
		const updateToFriend = await this.publishFriendStatus(
			friendStatus.rejected,
			friend,
			user
		);
		const updateToSelf = await this.publishFriendStatus(
			friendStatus.rejected,
			user,
			friend
		);

		return { reject };
	}
	async addFriend(username, friendUsername, mocked = false) {
		// const [userId, friendId] = await this.getUsersIdsByUsername([
		// 	username,
		// 	friend
		// ]);

		const [
			user,
			friend
		] = await this.api.repositories.users.getUserColumnsByUsername(
			[username, friendUsername],
			['oauth_id', 'id']
		);
		const existing = await this.postgresInstance
			.knex('friendship')
			.select('status')
			.where('member1_id', '=', user.id)
			.andWhere('member2_id', '=', friend.id);
		if (existing.length > 0) return {};
		const inserted1 = await this.postgresInstance.knex('friendship').insert({
			member1_id: user.id,
			member2_id: friend.id,
			status: friendStatus['sent'],
			mocked
		});
		const inserted2 = await this.postgresInstance.knex('friendship').insert({
			member1_id: friend.id,
			member2_id: user.id,
			status: friendStatus['pending'],
			mocked
		});
		const updateToFriend = await this.publishFriendStatus(
			friendStatus.pending,
			friend,
			user
		);
		const updateToSelf = await this.publishFriendStatus(
			friendStatus.sent,
			user,
			friend
		);

		return { inserted1, inserted2 };
	}

	async publishFriendStatus(status, to, from) {
		if (typeof to == 'string') {
			return this.api.redisAsync(
				'publish',
				`${user}:friend_request`,
				`${friend}:${status}`
			);
		}
		return this.api.redisAsync(
			'publish',
			`${to.id}:friend_request`,
			`${from.id}:${status}`
		);
	}
}

module.exports = FriendsRepository;
