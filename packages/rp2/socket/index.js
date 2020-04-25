// var io = socketIO.listen(app);
// const { io } = require('../app.js');
const ioType = require('socket.io');
const { useSession } = require('../config');
exports.SocketItem = class SocketItem {
	constructor(socket, api, redis, flush, additionalMethods = []) {
		this.socket = socket;
		this.api = api;
		this.redis = redis;
		this.flush = flush;
		if (this.getAdditionalHandlers) {
			const handlers = this.getAdditionalHandlers();
			console.log(handlers);
			handlers.forEach(({ type, handler }) => {
				socket.on(type, handler.bind(this));
			});
		}
		// console.log(this.additionalMethods);
		if (this.onMessage) {
			socket.on('message', this.onMessage.bind(this));
		}
		if (this.onDisconnect) {
			socket.on('disconnect', this.onDisconnect.bind(this));
		}
		if (additionalMethods.length > 0) {
			additionalMethods.forEach(({ name, method }) => {
				socket.on(name, method.bind(this));
			});
		}
	}
	onDisconnect() {
		this.flush(this.socket);
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
		this.onConnect = this.onConnect.bind(this);
		// this.onMessage = this.onMessage.bind(this);
		// this.createDefaultListeners();
		if (this.onConnect) {
			this.nsp.on('connection', this.onConnect);
		}
		this.SocketItemConstructor = SocketItemConstructor;
		this.socketItems = {};
		// this.createSocketItem = this.createSocketItem.bind(this);
		this.deleteSocketItem = this.deleteSocketItem.bind(this);
		// this.nsp.on('message', this.onMessage);
	}
	createSocketItem(socket, ...customArgs) {
		const item = new this.SocketItemConstructor(
			...customArgs,
			socket,
			this.api,
			this.redis,
			this.deleteSocketItem,
			this.additionalMethods
		);
		this.socketItems[socket.id] = item;
		console.log(`
		Created Socket Item:
			socket_id: ${socket.id}	
		`);
	}
	deleteSocketItem(socket) {
		delete this.socketItems[socket.id];
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
	async getSelf(socket) {
		if (!useSession) {
			let user = await this.api.repositories.auth.userFromSocket(socket);
			return user;
		} else {
			// Sessions not currently used, but available
			const { session = {} } = socket.request;
			const { passport = {} } = session;
			const { user = false } = passport;
			const isUser = user && user.username;
			return user;
		}
	}
};
