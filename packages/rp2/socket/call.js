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
	constructor(io) {
		super(io, nameSpace);
		this.createListeners(this.listeners);
	}
	onConnect(socket) {
		this.createDefaultListeners();
		const { session = {} } = socket.request;
		const { passport = {} } = session;
		const { user = false } = passport;
		client.set(user.nickname, socket.id);

		socket.on('message', this.onMessage);
		//socket.on('message1', )
	}
	onMessage(msg, secondArg) {
		console.log('GOT_MESSAGE', util.inspect(msg));
		this.broadcast.emit('message', msg, secondArg);
	}
	onMessage1(msg) {
		this.nsp.emit('message', msg);
	}

	// onDisconnect() {

	// }
}
module.exports = Call;
