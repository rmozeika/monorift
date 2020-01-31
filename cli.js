#!/usr/bin/env node

// let command = require('./command')

// command()
const util = require('util');
const path = require('path');
const fs = require('fs');
const { exec, execFile, spawn } = require('child_process');
const execa = util.promisify(require('child_process').exec);
//const ls = spawn('docker-compose up', [], {
const transferFiles = require('./scripts/xfer-files.js');
// exec('ls | grep js', (err, stdout, stderr) => {
//   if (err) {
//     //some err occurred
//     console.error(err)
//   } else {
//    // the *entire* stdout and stderr (buffered)
//    console.log(`stdout: ${stdout}`);
//    console.log(`stderr: ${stderr}`);
//   }
// });
let args = process.argv.slice(2);
if (args.length == 0) {
	// exec('')
	// return
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

	// await goToPath();
	// process.chdir('./packages/devops/docker/');
	// // async function lsExample() {
	// //     const { stdout, stderr } = await execa('ls');
	// //     console.log('stdout:', stdout);
	// //     console.error('stderr:', stderr);
	// //   }
	// const prcs = await execa('docker-compose up', ["-d"]);
	// const { error, stdout, stderr } = prcs
	//  console.log(stdout);
};

const composeDown = async () => {
	await goToPath();
	process.chdir('./packages/devops/docker/');
	// async function lsExample() {
	//     const { stdout, stderr } = await execa('ls');
	//     console.log('stdout:', stdout);
	//     console.error('stderr:', stderr);
	//   }
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
			name: 'commit',
			val: 'cm',
			func: async () => {
				console.log('test');
				const child = execFile('./.bin/mr.sh', ['cm'], (error, stdout, stderr) => {
					if (error) {
						throw error;
					}
					console.log(stdout);
				});
			}
		},
		start: {
			name: 'start',
			val: 'start',
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
			name: 'stop',
			val: 'stop',
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
		test: {
			name: 'test',
			val: 'test',
			func: async () => {
				var lib = path.join(path.dirname(fs.realpathSync(__filename)));
				console.log(lib);
			}
		},
		logs: {
			val: 'logs',
			func: async ([roll]) => {
				if (roll == 'roll') {
					const rolled = await util.promisify(
						fs.rename('./logs/compose', './logs/compose')
					);
					return;
				}
			}
		},
		kill: {
			val: 'kill',
			func: async args => {
				execFile('./dev.sh/docker-kill.sh', [], (error, stdout, stderr) => {
					console.log(stdout);
					console.log(stderr);
					console.log(error);
				});
				// const cmd = 'docker rmi -f $(docker images -a -q)';
				// const killDocker = spawn(
				// 	cmd
				// );
				// killDocker.stdout.on('data', data => {
				// 	console.log(`stdout: ${data}`);

				// });
				// killDocker.stderr.on('data', (data) => {
				// 	console.error(`stderr: ${data}`);
				//   });
				// killDocker.on('close', (code) => {
				// 	console.log(`child process exited with code ${code}`);
				//   });
				// spawn.close();
			}
		},
		build: {
			val: 'build',
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
		transfer: {
			val: 'transfer',
			func: async ([type, files]) => {
				transferFiles(files);
				console.log('done');
				// if (buildType === 'docker') {
				// isMonorift();
				// const buildDocker = spawn(
				// 	'docker build . -f ./packages/devops/docker/Dockerfile -t robertmozeika/rp2:latest'
				// );

				// spawn.close();
			}
		},
		dev: {
			val: 'dev',
			func: ([type, ...args]) => {
				return new Promise((resolve, reject) => {
					try {
						// const buildDevServer = await execa('webpack-dev-server --config webpack.config.js')
						// const buildDevServer = spawn('webpack-dev-server', [
						// 	'--config',
						// 	'webpack.config.js'
						// ]);
						// buildDevServer.stdout.on('data', data => {
						// 	console.log(data.toString());
						// });
						// buildDevServer.stdout.on('end', e => {
						// 	console.log(e);
						// 	resolve();
						// });
						debugger;
					} catch (e) {
						console.log(e);
					}
				});
				// if (buildType === 'docker') {
				//     isMonorift();
				//     const buildDocker = spawn('docker build . -f ./packages/devops/docker/Dockerfile -t robertmozeika/rp2:latest');

				//     spawn.close()
				// }
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
// const child = execFile('./.bin/mr.sh', ['cm'], (error, stdout, stderr) => {
//     if (error) {
//       throw error;
//     }
//     console.log(stdout);
//   });
// const myShellScript = exec('sh doSomething.sh /myDir');
// myShellScript.stdout.on('data', (data)=>{
//     console.log(data);
//     // do whatever you want here with data
// });
// myShellScript.stderr.on('data', (data)=>{
//     console.error(data);
// }) ;
