const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const path = require('path');

const currentPath = process.cwd();
const packagesPath = path.resolve(currentPath, 'packages');
const deployPath = path.resolve(packagesPath, 'deploy');
const scriptToRun = process.argv[2];

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

switch (scriptToRun) {
	case 'deployconf':
		transferDeployConf();
		break;
	case 'service':
		trasnferDeployService();
		break;
	default:
		console.log('No known statements, sending all');
		transferDeployConf();
		trasnferDeployService();
}
