const types = require('./types');
const iterateClass = require('./parse.class');
const parseVariable = require('./parse.variable')
module.exports = (program, parent, emitter) => {
    // scaffold.programs.push({
    //     name: fileName
    // })
    const iterator = (node, exported) => {
        console.log(program);
        if (node.type == types.Class) {
            const parsedClass = iterateClass(node, parent, emitter);
            return;
        }
        if (node.type == types.Export || node.type == types.ExportNamed) {
            iterator(node.declaration, true);
        }
        if (node.type == types.Variable) {
            const { start, end } = node;
            parseVariable(node.kind, node.declarations, { start, end }, parent, emitter);
        }
    }
    program.forEach(iterator);
    return { classes };
};

