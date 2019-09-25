// const rawSrc = `class App extends React.Component { render() { 
//     return ( <Provider store={store}> <ApplicationProvider mapping={mapping} theme={lightTheme} > <Homescreen /> </ApplicationProvider> </Provider> ); } } `
const babel = require("@babel/parser");
const textract = require('textract');
const fileName = './App.js'
const Class = require('./parse.class');
const File = require('./parse.file');
const Program = require('./parse.program');
module.exports = {
    Class,
    File,
    Program
}
// async function start() {
//     await rp2.init({})
//     const users = await rp2.repositories.users.findAll();

//     const codeRepo = rp2.repositories.code;
//     // const insert = await codeRepo.insertOne({ name: 'test'}, null, 'code.class')
//     console.log(users);


//     let uid = 0;
//     const uniqueUID = (type) => {
//         uid += t;
//         return `${type}-${uid}`
//     }
//     textract.fromFileWithPath(fileName, (err, text) => {
//         const types = {
//             Class: "ClassDeclaration",
//             program: "program"
//         }
//         const obj = babel.parse(text, {
//             // parse in strict mode and allow module declarations
//             sourceType: "module",

//             plugins: [
//                 // enable jsx and flow syntax
//                 "jsx",
//                 "flow"
//             ]
//         });

//         console.log(obj);
//         const parseFile = async (file) => {
//             const meta = {
//                 name: fileName,
//                 user: 'rmozeika',
//                 project: 'rift'
//             };
//             // const found = await codeRepo.findOne(meta, 'code.file');
//             // console.log(found)
//             // const insert = await codeRepo.insertOne(meta, 'code.file');
//             const foundUpdate = await codeRepo.findOneAndUpdate({
//                 filter: { name: fileName },
//                 doc: { $set: meta},
//                 opts: { upsert: true }
//             }, 'code.file');
//             Object.keys(file).forEach(key => {
//                 if (key == types.program) {
//                     return iterateProgram(file[key].body, insertedId);
//                 }
//             })
//             scaffold.file.push(meta);
//         }

//         const iterateProgram = (program, parent) => {
//             scaffold.programs.push({
//                 name: fileName
//             })
//             program.forEach(node => {
//                 if (node.type == types.class) {
//                     iterateClass(node, fileName);
//                     return;
//                 }
//             })
//         }

//         const scaffold = {
//             file: [],
//             programs: [],
//             classes: [],
//             methods: [],
//         };
//         const iterateClass = (classObj, parent) => {
//             console.log(rawSrc)
//             const mClass = ClassGenerator(classObj.id.name, parent, start, end)
//             return;
//         }

//         const ClassGenerator = (name, parent, start, end) => {
//             return {
//                 name: id,
//                 parent,
//                 position: {
//                     start,
//                     end
//                 }
//             }
//         }
//         parseFile(obj)
//     })

//     const store = (type, data) => {

//     }
// }

// start();