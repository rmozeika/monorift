module.exports = (kind, [variable], { start, end}, parent, emitter) => {
    const { id } = variable;
    if (!kind) kind = variable.kind;
    const { text, _id: parentID } = parent;
    const { name } = id;
    const toEmit = {
        name,
        kind,
        text: text.substring(start, end),
        start,
        end,
        parent: parent._id
    };
    console.log(toEmit);
    emitter.emit('variable', toEmit);
}