'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
	const hasSlash = inputPath.endsWith('/');
	if (hasSlash && !needsSlash) {
		return inputPath.substr(0, inputPath.length - 1);
	} else if (!hasSlash && needsSlash) {
		return `${inputPath}/`;
	} else {
		return inputPath;
	}
}

const getPublicUrl = appPackageJson =>
	envPublicUrl || require(appPackageJson).homepage;
function getServedPath(appPackageJson) {
	const publicUrl = getPublicUrl(appPackageJson);
	const servedUrl =
		envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
	return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
	'web.mjs',
	'mjs',
	'web.js',
	'js',
	'web.ts',
	'ts',
	'web.tsx',
	'tsx',
	'json',
	'web.jsx',
	'jsx'
];
const resolveModule = (resolveFn, filePath) => {
	const extension = moduleFileExtensions.find(extension =>
		fs.existsSync(resolveFn(`${filePath}.${extension}`))
	);

	if (extension) {
		return resolveFn(`${filePath}.${extension}`);
	}

	return resolveFn(`${filePath}.js`);
};
module.exports = {
	appPath: resolveApp('.'),
	appNodeModules: resolveApp('node_modules')
};

module.exports.moduleFileExtensions = moduleFileExtensions;
