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
		// socket.on('message', this.onMessage.bind(socket, this.redis));
		//socket.on('message1', )
	}
	// async onMessage(redis, msg, secondArg) {
	// }
	async onDisconnect(socket) {
		const { session = {} } = socket.request;
		const { passport = {} } = session;
		const { user = false } = passport;
		const isUser = user && user.username;
	}
	onMessage1(msg) {
		this.nsp.emit('message', msg);
	}

	// onDisconnect() {

	// }
}
module.exports = Call;
