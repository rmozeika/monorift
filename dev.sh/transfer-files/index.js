const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const path = require('path');

const currentPath = process.cwd();
const packagesPath = path.resolve(currentPath, 'packages');
const deployPath = path.resolve(packagesPath, 'deploy');

const transferDeployConf = async () => {
	const sendConf = path.resolve(deployPath, '.bin', 'update-conf.sh');
	const { stdout, stderr } = await execFile(sendConf, { cwd: deployPath });
	console.log(stdout, stderr);
};

transferDeployConf();
