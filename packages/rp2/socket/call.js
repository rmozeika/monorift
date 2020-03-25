const Socket = require('./index');
const nameSpace = 'call';
const util = require('util');

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
		super(io, nameSpace, api);
		this.createListeners(this.listeners);
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
		this.redis.set(user.username, socket.id);
		const userSock = this.io.of('/users'); //.broadcast.emit('message', username);
		if (user) {
			userSock.emit('broadcast', { username: user.username, online: true });
		}
		socket.on('message', this.onMessage.bind(socket, this.redis));
		socket.on('disconnect', this.onUserDisconnect.bind(socket, userSock, user));
	}
	async onUserDisconnect(userSock, user) {
		// console.log(this);
		// const { session = {} } = this.request;
		// const { passport = {} } = session;
		// const { user = false } = passport;
		// const userSock = io.of('/users'); //.broadcast.emit('message', username);
		if (user) {
			userSock.emit('broadcast', { username: user.username, online: false });
		}
	}
	async onMessage(redis, msg, secondArg) {
		// if (msg.type == 'answer') {
		// 	console.log(msg);
		// }
		if (secondArg) {
			const { users, constraints } = secondArg;
			// console.log('GOT_MESSAGE', util.inspect(msg));
			const mappedUsers = await Promise.all(
				users.map(async user => {
					try {
						const getAsync = util.promisify(redis.get).bind(redis);
						// if (user.id) return user;
						const id = await getAsync(user.username);
						return { username: user.username, id };
					} catch (e) {
						console.log(e);
					}
				})
			).then(res => {
				// console.log(`
				// 	Emitting to: ${res[0].id}
				// 	from: ${this.id}
				// 	msg: ${util.inspect(msg, true)}
				// 	users: ${util.inspect(users)}
				// 	constraints: ${constraints}
				// `);
				this.to(res[0].id).emit('message', msg, {
					users,
					constraints,
					from: {
						id: this.id,
						username: this.request.session.passport.user.username
					}
				});
			});
			// .catch(e => {
			// 	console.log(e);
			// });
		} else {
			this.broadcast.emit('message', msg, secondArg);
		}
	}
	onMessage1(msg) {
		this.nsp.emit('message', msg);
	}

	// onDisconnect() {

	// }
}
module.exports = Call;
