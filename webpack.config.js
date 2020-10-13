var webpack = require('webpack');
var path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const src = path.join(__dirname, './packages/rift/src');
const publicDir = path.resolve(__dirname, 'packages', 'rp2', 'public');

const baseConfig = require('./webpack.config.base.js');
const config = {
	mode: 'development',
	...baseConfig,
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist.web'),
		port: 9000,
		writeToDisk: true
	},
	plugins: [
		...baseConfig.plugins,
		new webpack.ids.DeterministicModuleIdsPlugin({
			maxLength: 5
		})
	],
	optimization: {
		//minimize: false,
		runtimeChunk: 'single',
		chunkIds: 'deterministic',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					//name: 'vendor',
					name: false,
					chunks: 'all',
					reuseExistingChunk: true,
					priority: -20
					//minimize: true,
				}
			}
		},
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				chunkFilter: chunk => {
					// Exclude uglification for the `vendor` chunk
					if (chunk.name === 'vendor') {
						return true;
					}

					return false;
				}
			})
		]
	}
};
module.exports = config;
