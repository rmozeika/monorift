const { Socket, SocketItem } = require('./index');
const nameSpace = '/call';
const util = require('util');
class UserItem extends SocketItem {
	constructor(...args) {
		super(...args);
	}
	async onMessage(msg, secondArg) {
		const { socket, redis } = this;
		if (secondArg) {
			const { users, constraints } = secondArg;
			// console.log('GOT_MESSAGE', util.inspect(msg));
			const mappedUsers = await Promise.all(
				users.map(async user => {
					try {
						const getAsync = util.promisify(redis.get).bind(redis);
						// if (user.id) return user;
						const id = await getAsync(`call:${user.oauth_id}`);
						return { username: user.username, id };
					} catch (e) {
						console.log(e);
					}
				})
			);
			// .then(async res => {
			// console.log(`
			// 	Emitting to: ${res[0].id}
			// 	from: ${this.id}
			// 	msg: ${util.inspect(msg, true)}
			// 	users: ${util.inspect(users)}
			// 	constraints: ${constraints}
			// `);
			const user = socket.request.session.passport.user;
			const actions = mappedUsers.map(async targetUser => {
				const emitted = await socket.to(targetUser.id).emit('message', msg, {
					users,
					constraints,
					from: {
						id: socket.id,
						username: user.username,
						oauth_id: user.oauth_id
					}
				});
				return emitted;
			});
			const result = await Promise.all(actions);
			console.log(result);
			// .then(result => {

			// })
			// socket.to(res[0].id).emit('message', msg, {
			// 	users,
			// 	constraints,
			// 	from: {
			// 		id: socket.id,
			// 		username: socket.request.session.passport.user.username
			// 	}
			// });
			// });
			// .catch(e => {
			// 	console.log(e);
			// });
		} else {
			socket.broadcast.emit('message', msg, secondArg);
		}
	}
}
class Call extends Socket {
	listeners = [
		{
			type: 'test',
			listener: () => {
				return 'test';
			}
		}
	];
	constructor(io, api) {
		super(io, nameSpace, api, UserItem);
		// this.createListeners(this.listeners);
		this.makeListener = this.makeListener.bind(this);
	}
	onConnect(socket) {
		this.createDefaultListeners();
		const { session = {} } = socket.request;
		const { passport = {} } = session;
		const { user = false } = passport;
		console.log(`
			User: ${user.username}
			SocketId: ${socket.id}
		`);
		this.redis.set(`call:${user.oauth_id}`, socket.id);
		// const userSock = this.io.of('/users'); //.broadcast.emit('message', username);
		// if (user) {
		// 	userSock.emit('broadcast', {
		// 		oauth_id: user.oauth_id,
		// 		username: user.username,
		// 		online: true
		// 	});
		// }
		this.createSocketItem(socket);
		// socket.on('message', this.onMessage.bind(socket, this.redis));
		// socket.on('message', this.makeListener(userSock))
		// REMOVE BELOW
		// socket.on('disconnect', this.onUserDisconnect.bind(socket, userSock, user));
	}

	async makeListener(func, ...args) {
		// return this[func]()
		return socket => {
			return this[func].apply(this, [socket, ...args]);
		};
	}
}
module.exports = Call;
