const { Socket, SocketItem } = require('./index');
const nameSpace = '/call';
const util = require('util');
const chalk = require('chalk');

const verbose = false;

class CallItem extends SocketItem {
	constructor(user, ...args) {
		super(...args);
		this.user = user;
	}
	usersMulticallList = (users, target) => {
		const { id, username } = this.user;
		let list = users.filter(user => {
			return user.id !== target.id;
		});
		//if (!users.some(usr => id === usr.id)) list.push({ id, username });
		return list.map(({ user }) => user);
	};
	socketIds = async users => {
		const { redis } = this;
		const users_socket_ids = await Promise.all(
			users.map(async user => {
				try {
					const getAsync = util.promisify(redis.get).bind(redis);
					// if (user.id) return user;
					const id = await getAsync(`call:${user.id}`);
					return { id, user };
				} catch (e) {
					console.error(e);
				}
			})
		);
		return users_socket_ids;
	};
	async onMessage(msg, opts) {
		const { socket, redis, user } = this;
		if (verbose) {
			console.log('MSG_TYPE', chalk.blue(msg.type));
			// console.log(chalk.blue(util.inspect(msg.type)));
			if (opts && opts.users)
				console.log('TO: ', chalk.green(util.inspect(opts.users[0])));

			console.log('CALL_MESSAGE', util.inspect(msg));
			if (opts) console.log('EXTRA_ARG', util.inspect(opts));
		}
		if (opts) {
			const { users, constraints, signature, call_id } = opts;
			// console.log('GOT_MESSAGE', util.inspect(msg));
			const users_socket_ids = await this.socketIds(users);
			// .then(async res => {
			// console.log(`
			// 	Emitting to: ${res[0].id}
			// 	from: ${this.id}
			// 	msg: ${util.inspect(msg, true)}
			// 	users: ${util.inspect(users)}
			// 	constraints: ${constraints}
			// `);
			const from = {
				//id: socket.id,
				username: user.username,
				id: user.id
			};
			if (msg.type == 'offer') {
				const startCall = await this.callInitiate(users_socket_ids, msg, opts);
				return;
			}

			const actions = users_socket_ids.map(async targetUser => {
				// const callList = this.usersMulticallList(users, target); //usersMulticall(from, users, targetUser.id);
				const emitted = await socket.to(targetUser.id).emit('message', msg, {
					users,
					// call_id: await bcrypt.genSalt();
					constraints,
					from
				});
				return emitted;
			});
			const result = await Promise.all(actions);
		} else {
			socket.broadcast.emit('message', msg, opts);
		}
	}
	callInitiate = async (users, msg, opts) => {
		const { constraints, signature, call_id } = opts;

		const { socket, redis, user } = this;

		// const { user } = this;
		// const call_id = await this.generateGroupCallId();
		const from = {
			//id: socket.id,
			username: user.username,
			id: user.id
		};

		// if signature = this.genCallSignature();
		const actions = users.map(async targetUser => {
			const callList = this.usersMulticallList(users, targetUser); //usersMulticall(from, users, targetUser.id);
			const emitted = await socket.to(targetUser.id).emit('message', msg, {
				users: callList,
				call_id: call_id || signature.call_id,
				constraints,
				initiator: signature.initiator,
				from,
				signature
			});
			return emitted;
		});
		const result = await Promise.all(actions);
		return result;
	};
	async genCallSignature(users) {
		const genCallSignature = this.api.repositories.auth.callSignature(
			this.user.id
		);
		return genCallSignature;
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
