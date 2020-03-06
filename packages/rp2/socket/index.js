// var io = socketIO.listen(app);
// const { io } = require('../app.js');
const ioType = require('socket.io');

class Socket {
	/**
	 *
	 * @param {ioType} io
	 * @param {nsp} nsp
	 */
	constructor(io, nsp, api) {
		this.io = io;
		this.nsp = io.of(nsp);
		this.api = api;
		this.redis = api.redis;
		console.log(io);
		// this.createDefaultListeners();
		if (this.onConnect) {
			this.nsp.on('connection', this.onConnect.bind(this));
		}
		// this.nsp.on('message', this.onMessage);
	}
	createDefaultListeners() {
		const { nsp } = this;

		if (this.onMessage) {
			nsp.on('message', this.onMessage.bind(this));
			nsp.on('message1', this.onMessage);
		}
		if (this.onDisconnect) {
			nsp.on('disconnect', this.onDisconnect);
		}
	}
	createListeners(listeners) {
		const { nsp } = this;
		listeners.forEach(({ type, listener }) => {
			nsp.on(type, listener);
		});
	}
}

module.exports = Socket;
