var webpack = require('webpack');
var path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

var src = path.join(__dirname, './packages/rift/src');

module.exports = {
	context: path.resolve(__dirname),
	entry: [path.join(src, 'index.js')],
	mode: 'development',
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
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
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
				test: /\.ttf$/,
				loader: require.resolve('url-loader'),
				include: path.resolve(__dirname, 'node_modules/react-native-vector-icons')
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 10000,
					name: 'static/media/[name].[hash:8].[ext]'
				}
			},
			{
				test: /\.(js|jsx|mjs|ts|tsx)$/,
				include: [
					path.resolve(__dirname, 'node_modules/react-native-elements'),
					path.resolve(__dirname, 'node_modules/react-native-elements/src'),
					path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
					path.resolve(__dirname, 'node_modules/react-native-ratings'),
					path.resolve(__dirname, 'node_modules/native-base-shoutem-theme'),
					path.resolve(__dirname, 'node_modules/react-navigation'),
					path.resolve(__dirname, 'node_modules/react-native-easy-grid'),
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
					path.resolve(__dirname, 'node_modules/@react-navigation/stack')
					// path.resolve(__dirname, 'node_modules/react-native-screens/screens.web.js')
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
		alias: {
			'react-native': 'react-native-web',
			'@src': path.resolve(__dirname, './packages/rift/src'),
			'react-native-svg': 'react-native-svg-web'
			// 'react-native-screens': 'react-native-screens/src/screens.web.js'
		},
		extensions: ['.ts', '.tsx', '.js']
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
		filename: '[name].bundle.js?ver[hash:6]'
	},
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist.web'),
		port: 9000,
		writeToDisk: true
	}
};
