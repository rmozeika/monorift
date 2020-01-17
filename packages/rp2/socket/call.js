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
		this.redis.set(user.nickname, socket.id);

		socket.on('message', this.onMessage.bind(this));
		//socket.on('message1', )
	}
	async onMessage(msg, { users, constraints }) {
		console.log('GOT_MESSAGE', util.inspect(msg));
		const mappedUsers = await users
			.map(async user => {
				const _id = await this.redis.get(user.name, socket.id);
				return { name: user.name, _id };
			})
			.catch(e => {
				console.log(e);
			});
		console.log(mappedUsers);
		this.broadcast.emit('message', msg, { users, constraints });
	}
	onMessage1(msg) {
		this.nsp.emit('message', msg);
	}

	// onDisconnect() {

	// }
}
module.exports = Call;
