const secret = 'test_secret_here';
const repo = '/home/ec2-user/monorift';
const path = require('path');
const https = require('http');
const net = require('net');
const { URL } = require('url');
const { exec } = require('child_process');
const fs = require('fs').promises;
const utils = require('./utils');
const qs = require('querystring');
const crypto = require('crypto');

console.log(utils);
var currentPath = process.cwd();
console.log(currentPath);

// Create an HTTP tunneling proxy
const proxy = https.createServer((req, res) => {
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
const hmac = crypto.createHmac('sha1', secret);

// Now that proxy is running
proxy.listen(9090, '127.0.0.1', () => {
	console.log('listening');
	proxy.on('request', (req, res) => {
		// crypto.verify(null);
		const altshakey = 'sha1=86274eaac703a16fab76ce308e6968a64ef19079';
		const shakey = req.headers['X-Hub-Signature'];
		const verify = crypto.createVerify('SHA1');

		console.log(req);
		const writePath = path.join(__dirname, 'history');
		let rawData = '';
		console.log('test');
		req.on('data', (data, var2) => {
			console.log(data, var2);

			rawData += data;
			const stringData = data.toString();
			const parsedData = qs.parse(stringData);
			console.log(parsedData);
			const payload = JSON.parse(parsedData.payload);
			// console.log(verify.verify(publicKey, signature));
			const digest = 'sha1=' + hmac.update(payload).digest('hex');
			const checksum = req.get(sigHeaderName);
			//crypto.verify(null, parsed, req.headers )
			utils.writeFile(writePath, parsed); //comment1test
		});
		req.on('end', data => {
			// qs(data);
			console.log(rawData);
			console.log(data);
		});
		res.on('data', (var1, var2) => {
			console.log(var1, var2);
		});
		if (req.body) {
			utils.writeFile(writePath, req.body);
		}
		if (req.query) {
			utils.writeFile(writePath, req.query);
		}
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
