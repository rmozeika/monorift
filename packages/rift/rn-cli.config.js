module.exports = {
	getProjectRoots() {
		const projectPath = path.resolve(__dirname);
		const rootModulesPath = path.resolve(__dirname, '../../node_modules');

		return [projectPath, rootModulesPath];
	},
	getTransformModulePath() {
		return require.resolve('react-native-typescript-transformer');
	},
	getSourceExts() {
		return ['ts', 'tsx'];
	},
	resolver: {
		extraNodeModules: {
			react: path.resolve(__dirname, 'node_modules/react')
		}
	}
};
