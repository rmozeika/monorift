const { Socket, SocketItem } = require('./index');
const nameSpace = '/call';
const util = require('util');
const chalk = require('chalk');

const verbose = true;

class CallItem extends SocketItem {
	constructor(user, ...args) {
		super(...args);
		this.user = user;
	}
	async onMessage(msg, secondArg) {
		const { socket, redis, user } = this;
		if (verbose) {
			console.log('MSG_TYPE', chalk.blue(msg.type));
			// console.log(chalk.blue(util.inspect(msg.type)));
			if (secondArg && secondArg.users)
				console.log('TO: ', chalk.green(util.inspect(secondArg.users[0])));
			// console.log('TYPE: ', msg.type);
			// if (secondArg && secondArg.users) console.log('TO: ', secondArg.users[0]);
			console.log('CALL_MESSAGE', util.inspect(msg));
			if (secondArg) console.log('EXTRA_ARG', util.inspect(secondArg));
		}
		if (secondArg) {
			const { users, constraints } = secondArg;
			// console.log('GOT_MESSAGE', util.inspect(msg));
			const mappedUsers = await Promise.all(
				users.map(async user => {
					try {
						const getAsync = util.promisify(redis.get).bind(redis);
						// if (user.id) return user;
						const id = await getAsync(`call:${user.id}`);
						return { username: user.username, id };
					} catch (e) {
						console.error(e);
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

			const actions = mappedUsers.map(async targetUser => {
				const emitted = await socket.to(targetUser.id).emit('message', msg, {
					users,
					constraints,
					from: {
						id: socket.id,
						username: user.username,
						id: user.id
					}
				});
				return emitted;
			});
			const result = await Promise.all(actions);
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
		super(io, nameSpace, api, CallItem);
	}
	async onConnect(socket) {
		const user = await this.getSelf(socket);
		if (!user) return;

		this.createDefaultListeners();

		logUser(user, socket);
		this.redis.set(`call:${user.id}`, socket.id);

		this.createSocketItem(socket, user);
	}
}

const logUser = (user, socket) => {
	console.log(`
User: ${user.username}
SocketId: ${socket.id}
`);
};
module.exports = Call;
