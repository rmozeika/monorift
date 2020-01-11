const hardCodedCommand = 'bash'; // null

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
const trasnferDeployService = async () => {
	const sendService = path.resolve(deployPath, '.bin', 'update-service.sh');
	const { stdout, stderr } = await execFile(sendService, { cwd: deployPath });
	console.log(stdout, stderr);
};

const transferDistWeb = async () => {
	const cmd = `rsync --recursive -v -e ssh  ./dist.web/. awsmono:/home/monorift/monorift/dist.web/.`;

	const sendingDist = await exec(cmd, { cwd: currentPath });
	console.log(sendingDist.stdout, sendingDist.stderr);
};

const transferBash = async () => {
	const sendBash = path.resolve(devopsPath, '.bin', 'send-bashrc.sh');
	const { stdout, stderr } = await execFile(sendBash, { cwd: deployPath });
	console.log(stdout, stderr);
};

switch (scriptToRun) {
	case 'deployconf':
		transferDeployConf();
		break;
	case 'service':
		trasnferDeployService();
		break;
	case 'dist':
		transferDistWeb();
		break;
	case 'bash':
		transferBash();
		break;
	default:
		console.log('No known statements, sending all');
		transferDeployConf();
		trasnferDeployService();
}
