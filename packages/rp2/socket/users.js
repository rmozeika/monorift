const Socket = require('./index');
const nameSpace = 'users';
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
		socket.on('message', this.onMessage.bind(socket, this.redis));
		//socket.on('message1', )
	}
	async onMessage(redis, msg, secondArg) {
		if (secondArg) {
			const { users, constraints } = secondArg;
			console.log('GOT_MESSAGE', util.inspect(msg));
			const mappedUsers = await Promise.all(
				users.map(async user => {
					try {
						const getAsync = util.promisify(redis.get).bind(redis);
						if (user.id) return user;
						const id = await getAsync(user.name);
						// Promise.resolve({ name: user.name, _id })
						return { name: user.name, id };
					} catch (e) {
						console.log(e);
					}
				})
			).then(res => {
				this.to(res[0].id).emit('message', msg, {
					users,
					constraints,
					from: { id: this.id, name: this.request.session.passport.user.username }
				});
			});
			// .catch(e => {
			// 	console.log(e);
			// });
			console.log(mappedUsers);
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
