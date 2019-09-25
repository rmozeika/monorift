const types = require('./types');
const iterateClass = require('./parse.class');
module.exports = (program, parent, emitter) => {
    // scaffold.programs.push({
    //     name: fileName
    // })
    const classes = [];
    const iterator = (node) => {
        if (node.type == types.Class) {
            const parsedClass = iterateClass(node, parent, emitter);
            classes.push(parsedClass);
            return;
        }
        if (node.type == types.Export) {
            iterator(node.declaration);
        }
    }
    program.forEach(iterator);
    return { classes };
};

