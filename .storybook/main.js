const custom = require('../webpack.config.js');
const path = require('path');

module.exports = {
	webpackFinal: config => {
		console.log('OLDCONFIG');
		console.dir(config, { depth: null }) || config;
		const newConfig = {
			...config,
			module: { ...config.module, rules: custom.module.rules }
		};
		console.log('NEWCONFIG');
		newConfig.resolve.alias = {
			'react-native': 'react-native-web',
			'@src': path.resolve(__dirname, '../packages/rift/src'),
			'react-native-svg': 'react-native-svg-web'
		};
		console.dir(newConfig, { depth: null });
		// newConfig.module.rules.push({
		//     test: /\.(ts|tsx)$/,
		//     use: [
		//       {
		//         loader: require.resolve('ts-loader'),
		//       },
		//     ],
		//   });
		//   newConfig.resolve.extensions.push('.ts', '.tsx');
		return newConfig;
	},
	stories: ['../packages/rift/src/**/*.stories.[tj]s']
};
