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

		// this.subscriber.subscribe(`${this.user.id}:friend_request`);
		this.subscriber.psubscribe(`${this.user.id}:*`);
		this.subscriber.subscribe('new_user');

		this.logConnection();
		this.connected();
	}
	getAdditionalHandlers() {
		return [
			{
				type: 'AM_ONLINE',
				handler: this.onAmOnline
			}
		];
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
		const channel = chan.replace(`${this.user.id}:`, '');
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
	setOnline() {
		const { user, socket, redis } = this;
		if (user && user.id) {
			const key = redis.sadd('online_users', user.username);
			redis.setbit('online_bit', user.id, 1);
			redis.set(user.username, socket.id);
			socket.broadcast.emit('message', {
				id: user.id,
				data: {
					online: true
				},
				user
			});
		}
	}
	onAmOnline(msg) {
		console.log(msg);
		this.setOnline();
	}
	connected() {
		const { user, socket, redis } = this;
		if (user && user.id) {
			try {
				const key = redis.sadd('online_users', user.username);
				redis.setbit('online_bit', user.id, 1);
				redis.set(user.username, socket.id);

				console.log('broadcast user online', user.username);

				socket.broadcast.emit('message', {
					id: user.id,
					data: {
						online: true
					},
					user
				});
			} catch (e) {
				console.error(e);
			}
		}
		// TODO: maybe uneeded
		this.api.repositories.users
			.updateByUsername(user.username, { socket_id: socket.id })
			// .then(result => {
			// 	console.log(result);
			// })
			.catch(e => {
				console.error(e);
			});
	}
	async onMessage(msg, secondArg) {}
	async onDisconnect() {
		this.subscriber.punsubscribe();
		const { user = {}, redis } = this;
		const { id, username } = user;
		if (user.id) {
			redis.setbit('online_bit', user.id, 0);
		}
		if (id) {
			console.log('broadcast user offline', username);
			try {
				this.socket.broadcast.emit('message', {
					id: user.id,
					data: {
						online: false
					},
					user
				});
			} catch (e) {
				console.error(e);
			}

			// .catch(e => {
			//     console.error(e);;
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

	async onConnect(socket) {
		// socket.emit('message', { test: 'val' });
		const user = await this.getSelf(socket);

		this.createSocketItem(socket, user);
	}
}

module.exports = User;
