module.exports = (node, parent, emitter) => {
    const { start, end , id, exported } = node;
    const { name } = id;
    const func = {
        name,
        start,
        end,
        text: parent.text.substring(start, end),
        parent: parent._id,
        exported
    }
    emitter.emit('function', func);
};