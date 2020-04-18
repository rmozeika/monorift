const { Socket, SocketItem } = require('./index');
const nameSpace = '/users';
const util = require('util');
const cookie = require('cookie');
class UserItem extends SocketItem {
	constructor(user, ...args) {
		super(...args);
		this.sub = this.sub.bind(this);
		this.user = user;
		// google-oauth2|100323185772603201403
		this.subscriber = this.redis.duplicate();
		this.subscriber.on('pmessage', this.psub);
		this.subscriber.on('message', this.sub);

		// this.subscriber.subscribe(`${this.user.oauth_id}:friend_request`);
		this.subscriber.psubscribe(`${this.user.oauth_id}:*`);
		this.subscriber.subscribe('new_user');

		this.logConnection();
		this.connected();
	}
	async sub(channel, message) {
		if (channel == 'new_user') {
			const user = await this.api.repositories.users.findById(message);
			this.socket.emit('message', {
				id,
				data: {
					online: true
					// friendStatus,
					// isFriend
				},
				user
			});
		}
	}
	psub = (pattern, chan, message) => {
		const channel = chan.replace(`${this.user.oauth_id}:`, '');
		if (channel == 'friend_request') {
			const [id, friendStatus] = message.split(':');
			const isFriend = ['P', 'A', 'S'].some(key => key == friendStatus);
			this.socket.emit('message', {
				id,
				data: {
					friendStatus,
					isFriend
				}
			});
			// this.socket.emit('FRIEND_REQUEST', message);
		}
		console.log(channel, message);
	};
	logConnection() {
		const { user = {} } = this;
		console.log(`User connected: ${user.username || 'anonymous_change'}`);
	}
	connected() {
		const { user, socket, redis } = this;
		if (user && user.id) {
			try {
				const key = redis.sadd('online_users', user.username);
				redis.setbit('online_bit', user.id, 1);
				redis.set(user.username, socket.id);
				// redis.hmset(`user:${user.username}`, [
				// 	'socketid',
				// 	socket.id,
				// 	'key',
				// 	user._id
				// ]);
				// socket.emit('broadcast', {
				//     oauth_id: user.oauth_id,
				//     username: user.username,
				//     online: true
				// });
				console.log('broadcast user online', user.username);
				// this.nsp.emit('message', {
				//     id: user.oauth_id,
				//     data: {
				//         online: true
				//     }
				// });
				socket.broadcast.emit('message', {
					id: user.oauth_id,
					data: {
						online: true
					},
					user
				});
			} catch (e) {
				console.log(e);
			}
			// .catch(e => {
			//     console.log(e);
			// })
		}
		this.api.repositories.users
			.updateByUsername(user.username, { socket_id: socket.id })
			.then(result => {
				console.log(result);
			});
	}
	async onMessage(msg, secondArg) {}
	async onDisconnect() {
		this.subscriber.punsubscribe();
		const { user = {}, redis } = this;
		const { oauth_id, username } = user;
		if (user.id) {
			redis.setbit('online_bit', user.id, 0);
		}
		if (oauth_id) {
			console.log('broadcast user offline', username);
			try {
				this.socket.broadcast.emit('message', {
					id: user.oauth_id,
					data: {
						online: false
					},
					user
				});
			} catch (e) {
				console.log(e);
			}

			// .catch(e => {
			//     console.log(e);
			// })
		}
	}
}
class User extends Socket {
	listeners = [
		{
			type: 'checkauth',
			listener: ack => {
				if (user) {
					ack(user);
					return;
				}
				ack({ user: false });
			}
		}
	];
	constructor(io, api) {
		super(io, nameSpace, api, UserItem);
		this.createListeners = this.createListeners.bind(this);
	}
	async getSelf(socket) {
		let user = await this.api.repositories.auth.userFromSocket(socket);
		if (!user) {
			const { session = {} } = socket.request;
			const { passport = {} } = session;
			// { user = false } = passport;
			user = passport.user || false;
			const isUser = user && user.username;
		}
		return user;
	}
	async onConnect(socket) {
		// socket.emit('message', { test: 'val' });
		const user = await this.getSelf(socket);

		this.createSocketItem(socket, user);
	}
	// async onMessage(redis, msg, secondArg) {
	// }
	async onDisconnect(socket) {
		// const { session = {} } = socket.request;
		// const { passport = {} } = session;
		// const { user = false } = passport;
		// const isUser = user && user.username;
		console.log('disconnected');
		if (user.username) {
			this.redis.srem('online_users', user.username);
		}
	}
	// onMessage(msg) {
	// 	this.nsp.emit('message', msg);
	// }

	// onDisconnect() {

	// }
}

module.exports = User;
