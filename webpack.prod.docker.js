var webpack = require('webpack');
var path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

var src = path.join(__dirname, './src');

module.exports = {
	context: path.resolve(__dirname),
	entry: [path.join(src, 'index.js')],
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader'
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
				loader: require.resolve('url-loader'), // or directly file-loader
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
				test: /\.(js|jsx|mjs)$/,
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
					path.resolve(__dirname, 'node_modules/@ui-kitten/eva-icons')
				],
				loader: require.resolve('babel-loader'),
				options: {
					presets: ['module:metro-react-native-babel-preset', '@babel/react'],
					plugins: [
						'react-native-web',
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-proposal-object-rest-spread'
					],
					cacheDirectory: true
				}
			}
		]
	},
	resolve: {
		alias: {
			'react-native': 'react-native-web',
			'@src': path.resolve(__dirname, './src')
		},
		extensions: ['.ts', '.tsx', '.js']
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: __dirname + '/public/index.html',
			filename: 'index.html'
		})
	],
	output: {
		path: path.join(__dirname, 'dist.web.prod'),
		publicPath: '/',
		filename: '[name].bundle.js'
	},
	devtool: 'source-map'
};
