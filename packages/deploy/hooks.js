const secret = 'test_secret_here';
const repo = '/home/ec2-user/monorift';
const path = require('path');
const http = require('http');
const net = require('net');
const { URL } = require('url');
const { exec } = require('child_process');
const fs = require('fs').promises;
const moment = require('moment');

var currentPath = process.cwd();
console.log(currentPath);
console.log(writefiledir);
const writeFile = txt => {
	const writefiledir = path.join(__dirname, 'history');
	const time = new moment().format('MMMM Do YYYY, h:mm:ss a');
	console.log(time);
	// console.log(time.toTimeString({ hour12: true }))
	const formattedText = `
        Started: ${time}
        ${txt}

    `;
	fs
		.appendFile(writefiledir, formattedText, 'utf8')
		.then(res => {
			console.log('done writing!');
		})
		.catch(e => {
			console.log('Error writing file', e);
		});
};

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('okay');
});
proxy.on('connect', (req, cltSocket, head) => {
	// Connect to an origin server
	const { port, hostname } = new URL(`http://${req.url}`);
	const srvSocket = net.connect(port || 80, hostname, () => {
		cltSocket.write(
			'HTTP/1.1 200 Connection Established\r\n' +
				'Proxy-agent: Node.js-Proxy\r\n' +
				'\r\n'
		);
		srvSocket.write(head);
		srvSocket.pipe(cltSocket);
		cltSocket.pipe(srvSocket);
	});
});

// Now that proxy is running
proxy.listen(9090, '127.0.0.1', () => {
	console.log('listening');
	proxy.on('request', (req, res) => {
		console.log(req);
	});
	proxy.on('data', data => {
		console.log(data);
	});
});

// const http = require('http');
// console.log('creating server...');
// http.createServer(function (req, res) {
//     console.log('created server!');

//     req.on('data', function(chunk) {
//         console.log('got data', chunk)
//         // let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

//         // if (req.headers['x-hub-signature'] == sig) {
//         //     exec('cd ' + repo + ' && git pull');
//         // }
//     });

//     res.end();
// }).listen(9090);
