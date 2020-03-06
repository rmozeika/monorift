const path = require('path');
const Config = require('./config');

module.exports = function(api) {
	api.cache(true);
	const moduleResolverConfig = {
		root: path.resolve('./'),
		alias: {
			'@kitten/theme': path.resolve(Config.KITTEN_PATH, 'theme'),
			'@kitten/ui': path.resolve(Config.KITTEN_PATH, 'ui'),
			'@eva-design/eva': path.resolve(Config.MAPPING_PATH),
			'@eva-design/processor': path.resolve(Config.PROCESSOR_PATH)
		}
	};
	const plugins = [
		[
			'module-resolver',
			moduleResolverConfig,
			'@babel/plugin-proposal-object-rest-spread'
		]
	];
	if (true)
		return {
			plugins,
			presets: ['module:metro-react-native-babel-preset']
		};
	return {
		presets: ['@babel/preset-env', '@babel/react'],
		plugins: [
			'@babel/plugin-proposal-do-expressions',
			['react-native-web', { commonjs: true }]
		]
	};
};
