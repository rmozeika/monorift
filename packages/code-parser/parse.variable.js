module.exports = (node, parent, emitter) => {
    let { declarations, kind, start, end, exported } = node;
    const [ variable ] = declarations;
    const { id, init } = variable;
    let func = init && init.type == 'ArrowFunctionExpress';
    if (!kind) kind = variable.kind;

    const { text, _id: parentID } = parent;
    const { name } = id;
    const toEmit = {
        name,
        kind,
        text: text.substring(start, end),
        start,
        end,
        parent: parent._id,
        exported,
        func
    };
    console.log(toEmit);
    emitter.emit('variable', toEmit);
}