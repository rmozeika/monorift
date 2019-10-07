const types = require('./types')
const iterateClass = (classObj, parent, emitter) => {
    const { start, end } = classObj;
    const Class = ClassGenerator(classObj.id.name, parent, start, end);
    emitter.emit('class', Class);

    return;
}

const ClassGenerator = (name, { _id, text }, start, end) => {
    return {
        name,
        parent: _id,
        position: {
            start,
            end
        },
        text: text.substring(start, end)
    }
}

module.exports = iterateClass;