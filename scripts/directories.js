const path = require('path');

const current = process.cwd();
const main = path.resolve(__dirname, '../');
const packages = path.resolve(main, 'packages');
const rp2 = path.resolve(packages, 'rp2');
const rift = path.resolve(packages, 'rift');
const deploy = path.resolve(packages, 'deploy');
const devops = path.resolve(packages, 'devops');
const src = path.resolve(rift, 'src');
module.exports = {
	current,
	main,
	deploy,
	devops,
	rift,
	rp2,
	src
};
