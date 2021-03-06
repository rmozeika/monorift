const iterateProgram = require('./parse.program');
const babel = require('@babel/parser');
const types = require('./types');
const parseFile = (
	{ text, name, _id, dir, key, index },
	project,
	user,
	emitter
) => {
	return new Promise((resolve, reject) => {
		try {
			const meta = {
				_id,
				name,
				user: 'rmozeika',
				project: 'rift',
				dir,
				key,
				index
			};

			if (!(/\.js$/.test(name) || /\.tsx$/.test(name)) || /\.tsx$/.test(name))
				return resolve({ status: 'done', filename: name });
			const fileParsed = parseText(text);
			const fileE = {
				...meta
			};
			emitter.emit('file', fileE);
			Object.keys(fileParsed).forEach(key => {
				if (key == types.program) {
					iterateProgram(fileParsed[key].body, { _id, text }, emitter);
				}
			});
			resolve({ status: 'done', filename: name });
		} catch (e) {
			reject(e);
		}
	});
};

const parseText = text => {
	const obj = babel.parse(text, {
		sourceType: 'module',
		plugins: ['jsx', 'typescript', 'classProperties']
	});
	return obj;
};

module.exports = parseFile;
