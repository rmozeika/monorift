const iterateProgram = require('./parse.program');
const babel = require('@babel/parser');
const types = require('./types');
const parseFile = ({ text, name, _id, dir, key, index }, project, user, emitter) => {
    return new Promise((resolve, reject) => {
        try {
            const meta = {
                _id,
                name,
                user: 'rmozeika',
                project: 'rift',
                dir,
                key,
                index
            };


            if (!(/\.js$/.test(name) || /\.tsx$/.test(name)) || /\.tsx$/.test(name)) return resolve({ status: 'done', filename: name });
            const fileParsed = parseText(text);
            // const found = await codeRepo.findOne(meta, 'code.file');
            // // console.log(found)
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
                    iterateProgram(fileParsed[key].body, { _id, text }, emitter);
                }
            })
            resolve({ status: 'done', filename: name })
            // console.log('done')
        } catch (e) {
            // console.log(name);
            // console.log(e);
            reject(e);
        }
    })
}

const parseText = (text) => {
    const obj = babel.parse(text, {
        sourceType: "module",
        plugins: [
            "jsx",
            "typescript",
            "classProperties"
        ]
    });
    return obj;
}

module.exports = parseFile;