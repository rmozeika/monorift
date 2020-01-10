const repo = '/home/ec2-user/monorift';
const path = require('path');
const http = require('http');
const util = require('util');
const net = require('net');
const { URL } = require('url');
const { exec, execFile, spawn } = require('child_process');
const execAsync = util.promisify(exec);
const execFileAsync = util.promisify(execFile);

const fs = require('fs').promises;
const utils = require('./utils');
const qs = require('querystring');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { secret, branch } = require('./conf.js');
console.log(secret);
const currentPath = process.cwd();
console.log(currentPath);

const express = require('express');
const app = express();
const port = 9090;
const debug = true; //change to false
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('*', (req, res) => {
	console.log(req);
});
app.post('*', async (req, res) => {
	const { body } = req;
	const sig = req.headers['x-hub-signature'];
	if (!sig || !body) return;
	const hmac = crypto.createHmac('sha1', secret);
	const digest = 'sha1=' + hmac.update(JSON.stringify(body)).digest('hex');

	const valid = sig == digest;
	if (!valid) return;
	const { ref } = body;
	console.log(req);
	if (ref == branch || debug) {
		const updateScript = path.resolve(__dirname, '.bin', 'update.sh');
		// const operation = await execFileAsync(updateScript, { cwd: __dirname }).catch(
		// 	e => {
		// 		console.log(e);
		// 	}
		// );
		const updateScr = spawn('./.bin/update.sh', [], { cwd: __dirname });
		let output = '';
		const logChunk = chunk => {
			let str = chunk.toString();
			console.log(str);
			output += str;
		};
		updateScr.stdout.on('data', logChunk);
		updateScr.stderr.on('data', logChunk);
		updateScr.on('close', code => {
			console.log('closed ' + code);
			const logFile = path.resolve(__dirname, 'history');
			writeFile(logFile, output);
		});
		// console.log(operation);
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const nativeServer = () => {
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
				// const payload = JSON.parse(parsedData);
				// console.log(verify.verify(publicKey, signature));
				const digest =
					'sha1=' + hmac.update(JSON.stringify(parsedData)).digest('hex');
				// const digestAlt = 'sha1=' + hmac.update(parsedData.payload).digest('hex');
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
};
