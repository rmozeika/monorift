const path = require('path');
const Config = require('./config');
const src = path.join(__dirname, './packages/rift/src');

module.exports = function(api) {
	api.cache(true);
	const moduleResolverConfig = {
		root: path.resolve('./'),
		extensions: [
			'.native.js',
			'.ios.js',
			'.android.js',
			'.js',
			'.ts',
			'.tsx',
			'.json'
		],
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
	const plugins = [
		[
			'module-resolver',
			moduleResolverConfig,
			'@babel/plugin-proposal-object-rest-spread'
		]
	];
	return {
		presets: ['module:metro-react-native-babel-preset', '@babel/react'],
		plugins: [
			'relay',
			'@babel/plugin-proposal-optional-chaining',
			['module-resolver', moduleResolverConfig],
			'react-native-web',
			'@babel/plugin-syntax-dynamic-import',
			'@babel/plugin-proposal-object-rest-spread',
			'transform-class-properties'
		]
	};
};
