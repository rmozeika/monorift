const types = require('./types');
const parseClass = require('./parse.class');
const parseVariable = require('./parse.variable');
const parseFunction = require('./parse.function');

module.exports = (program, parent, emitter) => {
	const iterator = (node, exported) => {
		if (node.type == types.Class) {
			const parsedClass = parseClass(node, parent, emitter);
			return;
		}
		if (node.type == types.Export || node.type == types.ExportNamed) {
			iterator({ exported, ...node.declaration });
		}
		if (node.type == types.Variable) {
			const { start, end } = node;
			parseVariable(node, parent, emitter);
		}
		if (node.type == types.Function) {
			parseFunction(node, parent, emitter);
			return;
		}
	};
	const forRef = program.map(node => {
		if (!node.declarations) return '';
		return node.declarations[0].id.name;
	});
	program.forEach(iterator);
	return;
};
