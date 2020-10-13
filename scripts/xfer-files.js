const hardCodedCommand = 'dist'; // null

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const exec = util.promisify(require('child_process').exec);

const path = require('path');
const paths = require('./directories');
const { current, packages, deploy, devops } = paths;
// const monorift =

const scriptToRun = process.argv[2] || hardCodedCommand;

const transferDeployConf = async () => {
	const sendConf = path.resolve(deploy, '.bin', 'update-conf.sh');
	const { stdout, stderr } = await execFile(sendConf, { cwd: deploy });
	console.log(stdout, stderr);
};
const transferDockerConf = async () => {
	//I think this isnt used
	const sendConf = path.resolve(devops, '.bin', 'update-conf.sh');
	const { stdout, stderr } = await execFile(sendConf, { cwd: devops });
	console.log(stdout, stderr);
};

const transferNginxConf = async () => {
	const nginxConf = path.resolve(devops, '.bin', 'nginx-conf.sh');
	const { stdout, stderr } = await execFile(nginxConf, { cwd: devops });
	console.log(stdout, stderr);
};
const backupNginxConf = async () => {
	const nginxConf = path.resolve(devops, '.bin', 'backup-nginx.sh');
	const { stdout, stderr } = await execFile(nginxConf, { cwd: devops });
	console.log(stdout, stderr);
};
const backupCerts = async () => {
	const certBackup = path.resolve(current, 'dev.sh', 'backup-certs.sh');
	const { stdout, stderr } = await execFile(certBackup, { cwd: current });
	console.log(stdout, stderr);
};
const transferPrivate = async () => {
	const sendPrivate = path.resolve(devops, '.bin', 'transfer-private.sh');
	const { stdout, stderr } = await execFile(sendPrivate, {
		cwd: current
	}).catch(e => {
		console.log(e);
	});
	console.log(stdout, stderr);
};
const trasnferDeployService = async () => {
	const sendService = path.resolve(deploy, '.bin', 'update-service.sh');
	const { stdout, stderr } = await execFile(sendService, { cwd: deploy });
	console.log(stdout, stderr);
};

const transferDistWeb = async () => {
	const buildProd = await exec('yarn run build:prod', { cwd: current });
	console.log(buildProd.stdout);
	if (buildProd.stderr !== '') {
		console.error(buildProd.stderr);
	}
	const cmd = `rsync --recursive -v -e ssh  ./dist.web.prod/. awsmono:/home/monorift/monorift/dist.web/.`;

	const sendingDist = await exec(cmd, { cwd: current });
	console.log(sendingDist.stdout, sendingDist.stderr);
};
const transferDistDev = async () => {
	const cmd = `rsync --recursive -v -e ssh  ./dist.web/. awsmono:/home/monorift/monorift/dist.web/.`;

	const sendingDist = await exec(cmd, { cwd: current });
	console.log(sendingDist.stdout, sendingDist.stderr);
};
const transferData = async () => {
	const cmd = `rsync --recursive -v -e ssh  ./packages/devops/data awsmono:/home/monorift/monorift/packages/devops`;

	const sendingData = await exec(cmd, { cwd: current });
	console.log(sendingData.stdout, sendingData.stderr);
};
const transferBash = async () => {
	const sendBash = path.resolve(devops, '.bin', 'send-bashrc.sh');
	const { stdout, stderr } = await execFile(sendBash, { cwd: deploy }).catch(
		e => {
			console.log(e);
		}
	);
	console.log(stdout, stderr);
};

module.exports = function(script) {
	switch (script) {
		case 'data':
			transferData();
			break;
		case 'deployconf':
			transferDeployConf();
			break;
		case 'devopsconf':
			transferDockerConf();
		case 'nginxconf':
			transferNginxConf();
		case 'backupnginx':
			backupNginxConf();
		case 'backupcerts':
			backupCerts();
		case 'service':
			trasnferDeployService();
			break;
		case 'dist':
			transferDistWeb();
			break;
		case 'distdev':
			transferDistDev();
			break;
		case 'bash':
			transferBash();
			break;
		case 'private':
			transferPrivate();
			break;
		case 'app':
			transferDistWeb();
			transferPrivate();
			break;
		default:
			console.log(
				`No known statements, [ "app", "deployconf", "devopsconf", "nginxconf", "service", "dist", "bash", "private"]`
			);
		// transferDeployConf();
		// trasnferDeployService();
	}
};
function defaultScript() {
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
}
