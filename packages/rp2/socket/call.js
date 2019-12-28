const Socket = require('./index');
const nameSpace = 'call';
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
		socket.on('message', this.onMessage);
		//socket.on('message1', )
	}
	onMessage(msg, secondArg) {
		this.broadcast.emit('message', msg, secondArg);
	}
	onMessage1(msg) {
		this.nsp.emit('message', msg);
	}

	// onDisconnect() {

	// }
}
module.exports = Call;
