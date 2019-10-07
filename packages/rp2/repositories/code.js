var Repository = require('./repository.js');
const textract = require('textract');
const path = require('path');
const esprima = require('esprima');
const git = require('nodegit');
const collection = 'code';
const fs = require('fs');
const util = require('util');
const acorn = require('acorn');
const parser = require('code-parser');
// const rift = require('rift');
const { ObjectId } = require('mongodb');
const EventEmitter = require('events');
class CodeEmitter extends EventEmitter {}

const readdir = util.promisify(fs.readdir);
class CodeRepository extends Repository {
    constructor(api) {
        const subcollections = 'code.class';
        super(api, collection); //, subcollections);
        
        const test = this.initRepo('rmozeika', 'rift', 'src').then((res)=> {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    async initRepo(user = 'rmozeika', repoName = 'rift', srcPath = './') {
        try {
            const repo = await this.clone(user, repoName);
            console.log(repo);
            const src = path.join(repo.path, srcPath);
            const files = await this.separateByFile(src);
            // console.log(fileNames);
            // const parsePromises = fileNames.map(({ name }) => {
            //     if (/\.tsx$/.test(name) || /\.js$/.test(name)) {
            //         return this.parseCodeFromFile(src, name);
            //     }
            // }).filter(parsePromise => parsePromise);
            // const files = await Promise.all(parsePromises);
            const { _id, fileMap } = await this.createProject(user, repoName, files);
            console.log(files);
            const codeEmitter = this.createListeners(_id);

            const parseFiles = () => {
                const resultFiles = [];
                fileMap.forEach((value, key) => {
                    const file = {
                        ...value,
                        name: key
                    };
                    const func =  async() => {
                        const result = await parser.File(file, repoName, user, codeEmitter).catch(e => {
                            console.log(e)
                        })
                        return result;
                    }
                    resultFiles.push(func());
                })

                return resultFiles;
            }

            const proms = parseFiles()
            const resu = await Promise.all(proms);
            return resu;

        } catch (e) {
            console.log(e.stack);
            return;
        };
    }
    async clone(user, repo, srcDir = './') {
        const downloadPath = path.join(path.join(__dirname, 'tmp', user, repo));
        const repository = await git.Clone(`https://github.com/${user}/${repo}`, downloadPath).catch(e => {
            return git.Repository.open(downloadPath);
        });
        return { repository, path: downloadPath };
    }
    async separateByFile(repository) {
        let fileList = [];

        const readFiles = async (dir) => {
            const readFile = util.promisify(fs.readFile);

            const files = await readdir(dir, { withFileTypes: true });
            if (files) {
                const fz = await Promise.all(files.map(async file => {
                    if (file.isDirectory()) {
                        const recurs = await readFiles(`${dir}/${file.name}`);
                        return `finished ${file.name}`;
                    }
                    const regexFilter = /.js$|.tsx/;
                    const customFilter = /App\.tsx/; ///ActionTypes\.js/;
                    const filter = customFilter ? customFilter : regexFilter;
                    if (!filter.test(file.name)) {
                        return `not parsed ${file.name}`;
                    }
                    const read = await readFile(path.join(dir, file.name), { encoding: 'utf-8'}).then(res => {
                        fileList.push({ text: res, name: file.name, dir, _id: ObjectId() });
                        return `finished ${file.name}`;
                    }).catch(e => {
                        console.log(e);
                    })
                })).catch(e => {
                    console.log(e);
                });
                console.log(fz);
            }
            return fileList;
        };
        const resultOfRead = await readFiles(repository);
        return resultOfRead;
    }
    parseCode(input) {
        return input;
    }
    parseCodeFromFile(repoPath, filename) {
        return new Promise((resolve, reject) =>{
            const file = path.join(repoPath, filename);
            if (file) {
                fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
                    resolve({ name: filename, text: data, _id: ObjectId()});
                })
            }
        });
    }
    async createProject(user, repo, files) {
        const existing = await this.findOne({ repo, user });
        const fileMap = new Map(files.map(({ name, _id, text, dir }) => {
            return [ name, { _id, text, dir }];
        }));
        if (!existing) {
            const fileIds = this.convertFileMapToDbArr(fileMap);
            const { insertedId } = await this.insertOne({ user, repo, fileIds });
            return { _id: insertedId, fileMap };
        }
        existing.fileIds.forEach(({ _id, name }) => {
            if (fileMap.has(name)) {
                const mapVal = fileMap.get(name);
                if (_id == null) _id = ObjectId();
                fileMap.set(name, { ...mapVal, _id });
            };
        });
        const fileIds = this.convertFileMapToDbArr(fileMap);
        const updated = await this.updateOne({ filter: { _id: existing._id }, doc: { $set: { fileIds: fileIds }}})
        return { _id: existing._id, fileMap };

        

    }
    convertFileMapToDbArr(fileMap) {
        const dbArr = [];
        fileMap.forEach(({ _id }, name) => {
            dbArr.push({ _id, name })
        });
        return dbArr;
    }
    createListeners(_id) {
        const codeEmitter = new CodeEmitter();

        codeEmitter.on('class', (c) => {
            console.log(c, this);
            const { parent, name } = c;
            this.findOne({ project: _id, parent, name }, 'code.class').then((res) => {
                if (!res) {
                    return this.insertClass({ ...c, project: _id });
                }
                return this.updateClass(res._id, c);
            }).then((res) => {
                console.log(res);
            }).catch((e) => {
                console.log(e);
            })
        });
        codeEmitter.on('variable', (v) => {
            const { parent, name } = v;
            this.findOne({ project: _id, parent, name }, 'code.variable').then((res) => {
                if (!res) {
                    return this.insertVariable({ ...v, project: _id})
                }
                return this.updateVariable(res._id, v);
            }).then((res) => {
                console.log(res);
            }).catch((e) => {
                console.log(e);
            })
        })
        codeEmitter.on('file', (f) => {
            console.log(f, this);
            this.updateFile(f._id, { ...f ,project: _id }).then(res => {
                console.log(res);
            }).catch(e => {
                console.log(f.name, e)
            });
        });

        return codeEmitter;

    }
    async updateVariable(_id, updated, opts = { upsert: true }) {
        return this.updateSubclass('code.variable', { filter: { _id }, doc: updated }, opts );
    }
    async insertVariable(insert, opts = {}) {
        return this.insertSubclass('code.variable', insert, opts);
    }

    async updateClass(_id, updated, opts = { upsert: true }) {
        return this.updateSubclass('code.class', { filter: { _id }, doc: updated }, opts );
    }
    async insertClass(insert, opts = {}) {
        return this.insertSubclass('code.class', insert, opts);
    }

    async insertFile(insert, opts = {}) {
        return this.insertSubclass('code.file', insert, opts);
    }
    async updateFile(_id, updated, opts = { upsert: true }) {
        return this.updateSubclass('code.file', { filter: { _id }, opts, doc: updated }, opts);
    }


    async insertSubclass(type, insert, opts = {}) {
        return this.insertOne({ doc: insert, opts }, type);
    }
    async updateSubclass(type, { doc, filter }, opts = {}) {
        return this.updateOne({ filter, doc: { $set: doc }, opts }, type);
    }
    errorHandler(e) {
        console.log(e);
        return { isError: true, error: e };
    }
}

module.exports = CodeRepository;
