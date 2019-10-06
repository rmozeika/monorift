const types = require('./types')
const iterateClass = (classObj, parent, emitter) => {
    const { start, end } = classObj;
    const Class = ClassGenerator(classObj.id.name, parent, start, end);
    emitter.emit('class', Class);

    return;
}

const ClassGenerator = (name, { _id }, start, end) => {
    return {
        name,
        parent: _id,
        position: {
            start,
            end
        }
    }
}

module.exports = iterateClass;