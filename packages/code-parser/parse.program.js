const types = require('./types');
const iterateClass = require('./parse.class');
const parseVariable = require('./parse.variable')
module.exports = (program, parent, emitter) => {
    // scaffold.programs.push({
    //     name: fileName
    // })
    const classes = [];
    const iterator = (node) => {
        console.log(program);
        if (node.type == types.Class) {
            const parsedClass = iterateClass(node, parent, emitter);
            classes.push(parsedClass);
            return;
        }
        if (node.type == types.Export) {
            iterator(node.declaration);
        }
        if (node.type == types.Variable) {
            const { start, end } = node;
            parseVariable(node.kind, node.declarations, { start, end }, parent, emitter);
        }
    }
    program.forEach(iterator);
    return { classes };
};

