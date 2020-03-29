// var io = socketIO.listen(app);
// const { io } = require('../app.js');
const ioType = require('socket.io');

exports.SocketItem = class SocketItem {
	constructor(socket, redis, additionalMethods = []) {
		this.socket = socket;
		this.redis = redis;
		if (this.onMessage) {
			socket.on('message', this.onMessage.bind(this));
		}
		if (this.onDisconnect) {
			socket.on('message', this.onDisconnect.bind(this));
		}
		if (additionalMethods.length > 0) {
			additionalMethods.forEach(({ name, method }) => {
				socket.on(name, method.bind(this));
			});
		}
	}
};
exports.Socket = class Socket {
	/**
	 *
	 * @param {ioType} io
	 * @param {nsp} nsp
	 */
	constructor(io, nsp, api, SocketItemConstructor) {
		this.io = io;
		this.nsp = nsp ? io.of(nsp) : io;
		this.api = api;
		this.redis = api.redis;
		console.log(io);
		this.onConnect = this.onConnect.bind(this);
		// this.onMessage = this.onMessage.bind(this);
		// this.createDefaultListeners();
		if (this.onConnect) {
			this.nsp.on('connection', this.onConnect);
		}
		this.SocketItemConstructor = SocketItemConstructor;
		this.socketItems = [];
		this.createSocketItem.bind(this);
		// this.nsp.on('message', this.onMessage);
	}
	createSocketItem(socket) {
		const item = new this.SocketItemConstructor(socket, this.redis);
		this.socketItems.push(item);
	}
	createDefaultListeners() {
		const { nsp } = this;

		// if (this.onMessage) {
		// 	nsp.on('message', this.onMessage.bind(socket, this.redis));
		// }
		// if (this.onDisconnect) {
		// 	nsp.on('disconnect', this.bind(socket, this.redis));
		// }
	}
	createListeners(socket) {
		const { listeners } = this;
		const { nsp } = this;
		listeners.forEach(({ type, listener }) => {
			nsp.on(type, listener.bind(socket));
		});
	}
};

// module.exports = Socket;
