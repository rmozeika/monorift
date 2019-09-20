var Repository = require('./repository.js');
const parser = require('parse-function');
// const clone = require('git-clone');
const textract = require('textract');
const path = require('path');
const esprima = require('esprima');
const git = require("nodegit");
const collection = 'code';
const fs = require('fs');
const util = require('util');
const acorn = require('acorn');


const readdir = util.promisify(fs.readdir);
class CodeRepository extends Repository {
    constructor(api) {
        const subcollections = 'code.class';
        super(api, collection) //, subcollections);
        
        const test = this.initRepo('rmozeika', 'rift', 'src').then((res)=> {
            console.log(res)
        });
    }

    async initRepo(user = 'rmozeika', repoName = 'rift', srcPath = './') {
        try {
            const repo = await this.clone(user, repoName)
            console.log(repo);
            const src = path.join(repo.path, srcPath)
            const files = await this.separateByFile(src);
            console.log(files);
            const parsePromises = files.map(({ name }) => {
                if (/App\.js$/.test(name)) {
                    return this.parseCodeFromFile(src, name);
                }
            }).filter(parsePromise => parsePromise);
            const fileText = await Promise.all(parsePromises);
            console.log(result)
        } catch (e) {
            console.log('failed');
        };
    }
    async clone(user, repo, srcDir = './') {
        const downloadPath = path.join(path.join(__dirname, 'tmp', user, repo))
        const repository = await git.Clone(`https://github.com/${user}/${repo}`, downloadPath).catch(e => {
            return git.Repository.open(downloadPath);
        });
        return { repository, path: downloadPath };
    }
    async separateByFile(repository) {
        const files = await readdir(repository, { withFileTypes: true });
        return files;
    }
    parseCode(input) {
        return input;
    }
    parseCodeFromFile(repoPath, filename) {
        return new Promise((resolve, reject) =>{
            const file = path.join(repoPath, filename);
            textract.fromFileWithPath(file, function( error, text ) {
                resolve({ filename, text });
            });
        });

        //         console.log(text);
        //         try {
        //             const parsed = esprima.parseModule(text, { range: true, jsx: true });
        //             // const tokenized = esprima.tokenize(text);
        //             const app = parser({
        //                 parse: acorn.parse,
        //                 ecmaVersion: 2017
        //             });
        //             const mappedFunctions = parsed.body.map(({ type, range }) => {
        //                 if (type !== "FunctionDeclaration") {
        //                     return null
        //                 }
        //                 return text.substr(range[0], range[1]);
        //             });
        //             const mappedAll = parsed.body.map(({ type, range }) => {
        //                 return text.substr(range[0], range[1]);
        //             });
        //             // const result = mappedFunctions.map(str => {
        //             //     return {
        //             //         parsed: app.parse(str),
        //             //         raw: str
        //             //     }
        //             // });
        //             const app2 = parser();
        //             const str = mappedAll[13].substr(15);
        //             const opts = { parse: acorn.parse, ecmaVersion: 2017}
        //             const result = app.parse(mappedAll[13].substr(15))
        //             resolve(result);
        //         } catch(e) {
        //             console.log(e);
        //             reject(e);
        //         }
        //     });
        // });
    }
    async updateFile(_id, updated, opts = { upsert: true }) {
        return this.updateSubclass('code.file', _id, updated, opts);
    }

    async updateClass(_id, updated, opts = { upsert: true }) {
        return this.updateSubclass('code.class', _id, updated, opts);
    }

    async updateSubclass(type, _id, updated, opts) {
        return this.updateOne({ filter: { _id: _id.toString()}, doc: { $set: updated }, opts }, type);
    }
    errorHandler(e) {
        console.log(e);
        return { isError: true, error: e }
    }
}

module.exports = CodeRepository;
