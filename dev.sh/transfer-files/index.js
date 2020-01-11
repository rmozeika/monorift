const hardCodedCommand = 'dist'; // null

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const exec = util.promisify(require('child_process').exec);

const path = require('path');

const currentPath = process.cwd();
const packagesPath = path.resolve(currentPath, 'packages');
const deployPath = path.resolve(packagesPath, 'deploy');
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
	default:
		console.log('No known statements, sending all');
		transferDeployConf();
		trasnferDeployService();
}
