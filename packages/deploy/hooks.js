const repo = '/home/ec2-user/monorift';
const path = require('path');
const http = require('http');
const util = require('util');
const net = require('net');
const { URL } = require('url');
const { exec, execFile, spawn } = require('child_process');
const execAsync = util.promisify(exec);
const execFileAsync = util.promisify(execFile);
var cookieParser = require('cookie-parser');
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
const debug = false; //change to false

const { authenticateSuperUser, ...restMw } = require('../rp2/middleware/jwt');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/deploy/update', authenticateSuperUser, async (req, res, next) => {
	console.log(req);
	const debug = true;
	// if (debug == true) {
	// 	res.send({ status: 'success' });
	// 	return;

	// }

	const result = await updateScript();
	res.send(result);
	// res.send(true);
});
app.get('*', (req, res) => {
	console.log('got req (get)');
	res.send('success');
});
app.post('*', async (req, res) => {
	console.log('Got request!');
	const { body } = req;
	const sig = req.headers['x-hub-signature'];
	if (!sig || !body) return;
	const hmac = crypto.createHmac('sha1', secret);
	const digest = 'sha1=' + hmac.update(JSON.stringify(body)).digest('hex');

	const valid = sig == digest;
	if (!valid) return;
	const { ref } = body;
	console.log(ref);
	if (ref == branch || debug) {
		console.log('Updating bash and writing file');
		// const updateScript = path.resolve(__dirname, '.bin', 'update.sh');
		const result = await updateScript();
		res.send(result);
	}
});

const updateScript = res => {
	return new Promise((resolve, reject) => {
		const updateScr = spawn('./.bin/update.sh', [], { cwd: __dirname });
		let output = '';
		const logChunk = chunk => {
			let str = chunk.toString();
			console.log('Chunk', str);
			output += str;
		};
		updateScr.stdout.on('data', logChunk);
		updateScr.stderr.on('data', logChunk);
		updateScr.on('close', code => {
			console.log('closed ' + code);
			const logFile = path.resolve(__dirname, 'history');
			utils.writeFile(logFile, output);
			resolve({ status: 'success', output });
		});
	});
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const nativeServer = () => {
	const proxy = http.createServer((req, res) => {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		res.end('okay');
	});
	proxy.on('connect', (req, cltSocket, head) => {
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
				const digest =
					'sha1=' + hmac.update(JSON.stringify(parsedData)).digest('hex');
				const checksum = req.get(sigHeaderName);
				utils.writeFile(writePath, parsed); //comment1test
			});
			req.on('end', data => {
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
