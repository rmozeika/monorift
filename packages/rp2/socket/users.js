// const Socket = require('./index');
// const nameSpace = 'users';
// const util = require('util');

// class Call extends Socket {
// 	listeners = [
// 		{
// 			type: 'checkauth',
// 			listener: ack => {
// 				if (user) {
// 					ack(user);
// 					return;
// 				}
// 				ack({ user: false });
// 			}
// 		}
// 	];
// 	constructor(io, api) {
// 		super(io, nameSpace, api);
// 		this.createListeners = this.createListeners.bind(this);
// 	}
// 	onConnect(socket) {
// 		this.createDefaultListeners();
// 		this.createListeners(socket);

// 		this.nsp.on('connection', async socket => {
// 			const { session = {} } = socket.request;
// 			const { passport = {} } = session;
// 			const { user = false } = passport;
// 			const isUser = user && user.username;
// 			if (isUser) {
// 				const key = client.sadd('online_users', user.username);
// 				client.set(user.username, socket.id);
// 				client.hmset(`user:${user.username}`, [
// 					'socketid',
// 					socket.id,
// 					'key',
// 					user._id
// 				]);
// 			}
// 			app.api.repositories.users
// 			.updateByUsername(user.username, { socket_id: socket.id })
// 			.then(result => {
// 				console.log(result);
// 			});
// 			socket.on('check_auth', );

// 		// socket.on('message', this.onMessage.bind(socket, this.redis));
// 		})	//socket.on('message1', )
// 	}
// 	// async onMessage(redis, msg, secondArg) {
// 	// }
// 	async onDisconnect(socket) {
// 		const { session = {} } = socket.request;
// 		const { passport = {} } = session;
// 		const { user = false } = passport;
// 		const isUser = user && user.username;
// 		console.log('disconnected');
// 		if (user.username) {
// 			client.srem('online_users', user.username);
// 		}
// 	}
// 	onMessage(msg) {
// 		this.nsp.emit('message', msg);
// 	}

// 	// onDisconnect() {

// 	// }
// }

// class UserSocket {
// 	constructor(socket, user)
// }
// module.exports = Call;
