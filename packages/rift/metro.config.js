/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

module.exports = {
	// projectRoot: path.resolve(__dirname, '../../'),
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: false
			}
		})
	},
	resolver: {
		blacklistRE: /(dist.web\/.*)|packages\/rp2\/\/*./, //, /packages\/rp2\/\/*./
		sourceExts: ['js', 'ts', 'tsx'],
		extraNodeModules: {
			// '@react-native-community': '../.../node_modules/@react-native-community',
			'@react-native-community': './node_modules/@react-native-community',

			'react-native-svg': '../../node_modules/react-native-svg'
		}
	},
	watchFolders: [
		path.resolve(__dirname, '../../node_modules'),
		path.resolve(__dirname, './')
	]
};
