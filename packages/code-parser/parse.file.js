const iterateProgram = require('./parse.program');
const babel = require('@babel/parser');
const types = require('./types');
const parseFile = ({ text, name, _id }, project, user, emitter) => {
    return new Promise((resolve, reject) => {
        const meta = {
            _id,
            name,
            user: 'rmozeika',
            project: 'rift'
        };
        try {
            const fileParsed = parseText(text);
            // const found = await codeRepo.findOne(meta, 'code.file');
            // console.log(found)
            // const insert = await codeRepo.insertOne(meta, 'code.file');
            // const foundUpdate = await codeRepo.findOneAndUpdate({
            //     filter: { name: fileName },
            //     doc: { $set: meta},
            //     opts: { upsert: true }
            // }, 'code.file');
            const fileE = {
                ...meta,
                // programs,
                // classes,
            };
            emitter.emit('file', fileE)
            Object.keys(fileParsed).forEach(key => {
                if (key == types.program) {
                    iterateProgram(fileParsed[key].body, _id, emitter);
                }
            })
            resolve({ status: 'done', filename: name })
            console.log('done')
        } catch (e) {
            console.log(name);
            console.log(e)
        }
    })
}

const parseText = (text) => {
    const obj = babel.parse(text, {
        // parse in strict mode and allow module declarations
        sourceType: "module",

        plugins: [
            // enable jsx and flow syntax
            "jsx",
            "flow"
        ]
    });
    return obj;
}

module.exports = parseFile;