const hardCodedCommand = 'dist'; // null

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const exec = util.promisify(require('child_process').exec);

const path = require('path');

const currentPath = process.cwd();
const packagesPath = path.resolve(currentPath, 'packages');
const deployPath = path.resolve(packagesPath, 'deploy');
const devopsPath = path.resolve(packagesPath, 'devops');

const scriptToRun = hardCodedCommand || process.argv[2];

const transferDeployConf = async () => {
	const sendConf = path.resolve(deployPath, '.bin', 'update-conf.sh');
	const { stdout, stderr } = await execFile(sendConf, { cwd: deployPath });
	console.log(stdout, stderr);
};
const transferDockerConf = async () => {
	const sendConf = path.resolve(devopsPath, '.bin', 'update-conf.sh');
	const { stdout, stderr } = await execFile(sendConf, { cwd: devopsPath });
	console.log(stdout, stderr);
};
const transferPrivate = async () => {
	const sendPrivate = path.resolve(devopsPath, '.bin', 'transfer-private.sh');
	const { stdout, stderr } = await execFile(sendPrivate, {
		cwd: currentPath
	}).catch(e => {
		console.log(e);
	});
	console.log(stdout, stderr);
};
const trasnferDeployService = async () => {
	const sendService = path.resolve(deployPath, '.bin', 'update-service.sh');
	const { stdout, stderr } = await execFile(sendService, { cwd: deployPath });
	console.log(stdout, stderr);
};

const transferDistWeb = async () => {
	const cmd = `rsync --recursive -v -e ssh  ./dist.web.prod/. awsmono:/home/monorift/monorift/dist.web/.`;

	const sendingDist = await exec(cmd, { cwd: currentPath });
	console.log(sendingDist.stdout, sendingDist.stderr);
};

const transferBash = async () => {
	const sendBash = path.resolve(devopsPath, '.bin', 'send-bashrc.sh');
	const { stdout, stderr } = await execFile(sendBash, { cwd: deployPath }).catch(
		e => {
			console.log(e);
		}
	);
	console.log(stdout, stderr);
};

switch (scriptToRun) {
	case 'deployconf':
		transferDeployConf();
		break;
	case 'devopsconf':
		transferDockerConf();
	case 'service':
		trasnferDeployService();
		break;
	case 'dist':
		transferDistWeb();
		break;
	case 'bash':
		transferBash();
		break;
	case 'private':
		transferPrivate();
		break;
	default:
		console.log('No known statements, sending all');
		transferDeployConf();
		trasnferDeployService();
}
