const path = require('path');

module.exports = {
	ENV: 'dev',
	KITTEN_PATH: path.resolve(__dirname, '../node_modules/@ui-kitten/components'),
	MAPPING_PATH: path.resolve(__dirname, '../node_modules/@eva-design/eva'),
	PROCESSOR_PATH: path.resolve(
		__dirname,
		'../node_modules/@eva-design/processor'
	)
};
