const path = require('path');
const Config = require('./config');
const src = path.resolve(__dirname, 'src');
module.exports = function(api) {
	api.cache(true);
	const moduleResolverConfig = {
		root: path.resolve('./'),
		extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
		alias: {
			'@kitten/theme': path.resolve(Config.KITTEN_PATH, 'theme'),
			'@kitten/ui': path.resolve(Config.KITTEN_PATH, 'ui'),
			'@eva-design/eva': path.resolve(Config.MAPPING_PATH),
			'@eva-design/processor': path.resolve(Config.PROCESSOR_PATH),
			'@src': src,
			'@components': path.resolve(src, 'components'),
			'@containers': path.resolve(src, 'containers'),
			'@selectors': path.resolve(src, 'selectors'),
			'@reducers': path.resolve(src, 'reducers'),
			'@actions': path.resolve(src, 'actions', 'index.js'),
			'@core': path.resolve(src, 'core')
		}
	};
	const plugins = [['module-resolver', moduleResolverConfig]];
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
