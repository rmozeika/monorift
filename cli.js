#!/usr/bin/env node

const util = require('util');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { exec, execFile, spawn } = require('child_process');
const execa = util.promisify(require('child_process').exec);
const transferFiles = require('./scripts/xfer-files.js');

let args = process.argv.slice(2);
if (args.length == 0) {
	args = ['start'];
}
const isDockerContainersRunning = async () => {
	const psCmd = await execa(
		' docker ps --filter "label=com.monorift.app=monorift" --quiet',
		[]
	);
	const { error, stdout, stderr } = psCmd;
	if (!stdout) {
		return false;
	}
	const runningContainers = stdout.match(/[a-z0-9]+\n/g);
	if (runningContainers.length == 3) {
		return true;
	}
	if (runningContainers.length > 0) {
		return true;
		//  not all running though, need to change this
	}
	return false;
};
const runCmd = (cmd, args, dir = false) => {
	return new Promise((resolve, reject) => {
		let opts = dir ? { cw: dir } : {};
		var stream = fs.createWriteStream('./logs/compose', { flags: 'a' });

		const ls = spawn(cmd, args, opts);
		ls.stdout.on('data', data => {
			const outData = data.toString();
			stream.write(outData);
			console.log(outData);
		});

		ls.stderr.on('data', data => {
			const outData = data.toString();
			stream.write(outData);
			console.log(outData);
		});

		ls.on('close', code => {
			console.log(`child process exited with code ${code}`);
			stream.end();
			resolve();
		});
	});
};
const composeUp = () => {
	return new Promise((res, rej) => {
		const ls = spawn('docker-compose', ['up'], {
			cwd: './packages/devops/docker',
			env: process.env
		});
		var stream = fs.createWriteStream('./logs/compose', { flags: 'a' });

		ls.stdout.on('data', data => {
			const outData = data.toString();
			console.log(outData);
			stream.write(outData);
		});

		ls.stderr.on('data', data => {
			const outData = data.toString();
			stream.write(outData);

			console.log(outData);
		});

		ls.on('close', code => {
			console.log(`child process exited with code ${code}`);
			stream.end();

			res();
		});
	});
};

const composeDown = async () => {
	await goToPath();
	process.chdir('./packages/devops/docker/');
	const prcs = await execa('docker-compose down', []);
	const { error, stdout, stderr } = prcs;
	console.log(stdout);
};

async function isMonorift() {
	const isMonorift = pwd.stdout.match(/monorift\/.+/);
	if (isMonorift.length > 0) {
		const prcs = await execa(
			'touch .temp && chmod +xrw .temp && echo "echo $(pwd)" > .temp'
		);
		const test = await execa('pwd');
		const testFile = await exaca('.temp');
		prcs.chdir('~/Development/monorift/');
	}
	console.log(pwd);
}

async function goToPath() {
	var lib = path.join(path.dirname(fs.realpathSync(__filename)));
	process.chdir(lib);
}

const argInterface = {
	main: {
		cm: {
			func: async () => {
				console.log('Committing...');
				const child = execFile('./.bin/mr.sh', ['cm'], (error, stdout, stderr) => {
					if (error) {
						throw error;
					}
					console.log(stdout);
				});
			}
		},
		build: {
			func: async () => {
				console.log('Building docker locally for remote deployment...');
				const child = execFile(
					'./packages/deploy/.bin/update-stage.sh',
					[],
					{ cwd: __dirname },
					(error, stdout, stderr) => {
						if (error) {
							throw error;
						}
						console.log(stdout);
					}
				);
			}
		},
		start: {
			func: async () => {
				const isRunning = await isDockerContainersRunning();
				if (isRunning) {
					console.log('Stopping monorift and restarting ');
					const compose = await composeDown();
					const up = await composeUp();
					return;
				} else {
					const compose = await composeUp();
					return;
				}
			}
		},
		stop: {
			func: async (...args) => {
				const isRunning = await isDockerContainersRunning();
				if (isRunning) {
					console.log('Killing containers\n');
					const compose = await composeDown();
				} else {
					console.log('Monorift has not been started\n Run monorift start');
				}
			}
		},
		// shorthand: i for 'rift' and 2 for 'rp2
		add: {
			func: async ([type, addToPackage, ...packagesToAdd]) => {
				const shorthand = { i: 'packages/rift', '2': 'packages/rp2' };

				let addTo = shorthand[addToPackage] || addToPackage;
				const addOpts = await Promise.all(
					packagesToAdd.map(async packageName => {
						let cmd = `lerna add ${packageName} ${addTo}`;

						const { stdout, stderr } = await execa(cmd, { cwd: __dirname }).catch(
							e => {
								console.error(e);
							}
						);
						// const addOperation = await exec(cmd, { cwd: __dirname });

						console.log(packageName, stdout);
						console.error(packageName, stderr);
					})
				).catch(e => {
					console.error(e);
				});
				console.log(`
					done adding to ${addTo}
					${packagesToAdd.join(' ')}
				`);
			}
		},
		clean: {
			func: async (...args) => {
				execFile('./dev.sh/clean.sh', [], (error, stdout, stderr) => {
					console.log(stdout);
					console.log(stderr);
					console.log(error);
				});
			}
		},
		test: {
			func: async () => {
				var lib = path.join(path.dirname(fs.realpathSync(__filename)));
				console.log(lib);
			}
		},
		logs: {
			func: async ([roll]) => {
				if (roll == 'roll') {
					const rolled = await util.promisify(
						fs.rename('./logs/compose', './logs/compose')
					);
					return;
				}
			}
		},
		// tail docker logs
		log: {
			func: async ([roll]) => {
				const cmd = 'docker';
				const args = ['logs', '-ft', 'mrapp'];
				const opts = {};
				const ls = spawn(cmd, args, opts);
				ls.stdout.on('data', data => {
					const outData = data.toString();
					// stream.write(outData);
					console.log(outData);
				});

				ls.stderr.on('data', data => {
					const outData = data.toString();
					// stream.write(outData);
					console.log(outData);
				});

				ls.on('close', code => {
					console.log(`child process exited with code ${code}`);
					// stream.end();
					// resolve();
				});
			}
		},
		kill: {
			func: async args => {
				execFile('./dev.sh/docker-kill.sh', [], (error, stdout, stderr) => {
					console.log(stdout);
					console.log(stderr);
					console.log(error);
				});
			}
		},
		build: {
			func: async ([buildType, ...args]) => {
				if (buildType === 'docker') {
					isMonorift();
					const buildDocker = spawn(
						'docker build . -f ./packages/devops/docker/Dockerfile -t robertmozeika/rp2:latest'
					);

					spawn.close();
				}
			}
		},
		resetcontainers: {
			func: async args => {
				execFile('./dev.sh/docker/remove.sh', [], (error, stdout, stderr) => {
					console.log(stdout);
					console.log(stderr);
					console.log(error);
				});
			}
		},
		tunnel: {
			func: async ([type, files]) => {
				execFile('./dev.sh/tunnel-aws.sh', [], (error, stdout, stderr) => {
					console.log(stdout);
					console.log(stderr);
					console.log(error);
				});
			}
		},
		transfer: {
			func: async ([type, files]) => {
				transferFiles(files);
				console.log('done');
			}
		},
		jwt: {
			func: async ([
				type,
				secret = 'DONT USE! DIDNT CHANGE, so change me!',
				secret2,
				...args
			]) => {
				console.log(`generate secret using: ${secret}`);
				// const gen = crypto.createSecretKey(secret);
				const hmac = crypto.createHmac('sha256', secret);
				const sec = hmac.update(secret2).digest('hex');
				console.log(sec);
			}
		}
	}
};

const [mainArg, ...otherArgs] = args;
const cmd = argInterface.main[mainArg];
if (!cmd) {
	console.log(`no known argument: ${mainArg}`);
	return;
}
async function run() {
	const { func } = cmd;
	const asynctask = await func([...args]);
	console.log('done');
}
run();
