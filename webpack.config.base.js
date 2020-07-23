var webpack = require('webpack');
var path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const src = path.join(__dirname, './packages/rift/src');
const publicDir = path.resolve(__dirname, 'packages', 'rp2', 'public');
const Config = require('./packages/rp2/config.js');
const cacheBust = false;
module.exports = {
	context: path.resolve(__dirname),
	entry: [path.join(src, 'index.js')],
	// mode: 'development',
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.json',
							ignoreDiagnostics: [1144]
						}
					}
				]
			},
			{
				use: {
					loader: 'babel-loader'
					// options: {
					// 	presets: ['@babel/preset-env']
					// }
				},
				test: /\.(js|jsx)$/,
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader'
					}
				]
			},
			{
				test: /\.(ttf|otf)$/,
				loader: require.resolve('url-loader'),
				include: [
					path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
					path.resolve(src, 'static')
				]
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 10000,
					name: (cacheBust) ? 'static/media/[name].[hash:8].[ext]' : 'static/media/[name].[ext]'
				}
			},
			{
				test: /\.(web.js|js|jsx|mjs|ts|tsx)$/,
				include: [
					// path.resolve(__dirname, 'node_modules/react-native-elements'),
					// path.resolve(__dirname, 'node_modules/react-native-elements/src'),
					path.resolve(__dirname, 'node_modules/react-native-svg-web'),
					path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
					path.resolve(__dirname, 'node_modules/react-native-ratings'),
					path.resolve(__dirname, 'node_modules/native-base-shoutem-theme'),
					path.resolve(__dirname, 'node_modules/react-navigation'),
					path.resolve(__dirname, 'node_modules/react-native-easy-grid'),
					path.resolve(__dirname, 'node_modules/react-native-reanimated'),
					path.resolve(__dirname, 'node_modules/react-native-gesture-handler'),
					path.resolve(__dirname, 'node_modules/react-native-drawer'),
					path.resolve(__dirname, 'node_modules/react-native-safe-area-view'),
					path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
					path.resolve(
						__dirname,
						'node_modules/react-native-keyboard-aware-scroll-view'
					),
					path.resolve(__dirname, 'node_modules/react-native-web'),
					path.resolve(__dirname, 'node_modules/react-native-tab-view'),
					path.resolve(__dirname, 'node_modules/static-container'),
					path.resolve(__dirname, 'node_modules/@ui-kitten/components'),
					path.resolve(__dirname, 'node_modules/@ui-kitten/eva-icons'),
					path.resolve(__dirname, 'node_modules/@react-navigation/core'),
					path.resolve(__dirname, 'node_modules/@react-navigation/native'),
					path.resolve(__dirname, 'node_modules/@react-navigation/routers'),
					path.resolve(__dirname, 'node_modules/@react-navigation/stack'),
					path.resolve(__dirname, 'node_modules/@react-navigation/bottom-tabs'),
					path.resolve(__dirname, 'node_modules/react-native-screens')
				],
				loader: require.resolve('babel-loader')
				// options: {
				// 	presets: ['module:metro-react-native-babel-preset', '@babel/react'],

				// 	plugins: [
				// 		'react-native-web',
				// 		'@babel/plugin-syntax-dynamic-import',
				// 		'@babel/plugin-proposal-object-rest-spread'
				// 	],
				// 	cacheDirectory: true
				// }
			}
		]
	},
	resolve: {
		mainFields: ['browser', 'module', 'main'],
		extensions: [
			// '.web.expo.ts',  '.web.expo.tsx',
			// '.web.expo.mjs', '.web.expo.js',
			// '.web.expo.jsx', '.expo.ts',
			// '.expo.tsx',     '.expo.mjs',
			// '.expo.js',      '.expo.jsx',
			'.web.ts',
			'.web.tsx',
			'.web.mjs',
			'.web.js',
			'.web.jsx',
			'.ts',
			'.tsx',
			'.mjs',
			'.js',
			'.jsx',
			'.json',
			'.wasm'
		],
		alias: {
			// 'react-native': 'react-native-web',
			'@babel/runtime': path.resolve(__dirname, './node_modules/@babel/runtime'),
			react: path.resolve(__dirname, './node_modules/react'),
			'react-native': path.resolve(__dirname, './node_modules/react-native-web'),
			'react-native-web': path.resolve(
				__dirname,
				'./node_modules/react-native-web'
			),
			'react-native-svg': 'react-native-svg-web',
			'@src': src,
			'@components': path.resolve(src, 'components'),
			'@containers': path.resolve(src, 'containers'),
			'@selectors': path.resolve(src, 'selectors'),
			'@reducers': path.resolve(src, 'reducers'),
			'@actions': path.resolve(src, 'actions', 'index.js'),
			'@core': path.resolve(src, 'core')

			// 'react-native-screens': 'react-native-screens/src/screens.web.js'
		}
		// extensions: ['.ts', '.tsx', '.js']
	},
	externals: {
		Config: Config
	},
	watchOptions: {
		ignored: /node_modules/
	  },
	plugins: [
		new HtmlWebPackPlugin({
			template: __dirname + '/packages/rift/public/index.html',
			filename: 'index.html'
		})
	],
	output: {
		path: path.join(__dirname, 'dist.web'),
		publicPath: '/',
		//filename: '[name].bundle.js?ver[hash:6]',
		filename: (cacheBust) ? '[name].bundle.js?ver[hash:6]' : '[contentHash].[name].bundle.js'

	}
};
