// var io = socketIO.listen(app);
// const { io } = require('../app.js');
const ioType = require('socket.io');

class Socket {
    /**
     * 
     * @param {ioType} io 
     * @param {nsp} nsp 
     */
	constructor(io, nsp) {
		this.io = io;
		this.nsp = io.of(nsp);
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
			nsp.on('message', this.onMessage);
			nsp.on('message1', this.onMessage);
        }
        if (this.onDisconnect) {
            nsp.on('disconnect', this.onDisconnect);
        }
    }
    createListeners(listeners) {
        const { nsp } = this;
        listeners.forEach(({ type, listener })=> {
            nsp.on(type, listener);
        });
    }
}
if (false) {
	const { io } = require('../app.js');
	io.sockets.on('connection', function(socket) {
		// convenience function to log server messages on the client
		function log() {
			var array = ['Message from server:'];
			array.push.apply(array, arguments);
			socket.emit('log', array);
		}

		socket.on('message', function(message) {
			log('Client said: ', message);
			// for a real app, would be room-only (not broadcast)
			socket.broadcast.emit('message', message);
		});

		socket.on('create or join', function(room) {
			log('Received request to create or join room ' + room);

			var clientsInRoom = io.sockets.adapter.rooms[room];
			var numClients = clientsInRoom
				? Object.keys(clientsInRoom.sockets).length
				: 0;

			log('Room ' + room + ' now has ' + numClients + ' client(s)');

			if (numClients === 0) {
				socket.join(room);
				log('Client ID ' + socket.id + ' created room ' + room);
				socket.emit('created', room, socket.id);
			} else if (numClients === 1) {
				log('Client ID ' + socket.id + ' joined room ' + room);
				io.sockets.in(room).emit('join', room);
				socket.join(room);
				socket.emit('joined', room, socket.id);
				io.sockets.in(room).emit('ready');
			} else {
				// max two clients
				socket.emit('full', room);
			}
		});
	});
}

module.exports = Socket;
