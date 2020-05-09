var Repository = require('./repository.js');
const path = require('path');
const esprima = require('esprima');
const collection = 'code';
const fs = require('fs');
const util = require('util');
const parser = require('code-parser');
const { ObjectId } = require('mongodb');
const EventEmitter = require('events');

const readdir = util.promisify(fs.readdir);
class CodeRepository extends Repository {
	constructor(api) {
		const subcollections = 'code.class';
		super(api, collection); //, subcollections);
	}

	async initRepo(user = 'rmozeika', repoName = 'rift', srcPath = './') {
		try {
			const repo = await this.clone(user, repoName);
			const src = path.join(repo.path, srcPath);
			const files = await this.separateByFile(src);
			const { _id, fileMap } = await this.createProject(user, repoName, files);
			console.log(files);
			const codeEmitter = this.createListeners(_id);

			const parseFiles = () => {
				const resultFiles = [];
				fileMap.forEach((value, key) => {
					const file = {
						...value,
						key
					};
					const func = async () => {
						const result = await parser
							.File(file, repoName, user, codeEmitter)
							.catch(e => {
								console.log(e);
							});
						return result;
					};
					resultFiles.push(func());
				});

				return resultFiles;
			};

			const proms = parseFiles();
			const resu = await Promise.all(proms);
			const ended = await codeEmitter.isEnded();
			return resu;
		} catch (e) {
			console.log(e.stack);
			return;
		}
	}
	async clone(user, repo, srcDir = './') {
		const downloadPath = path.join(path.join(__dirname, 'tmp', user, repo));
		const repository = await git
			.Clone(`https://github.com/${user}/${repo}`, downloadPath)
			.catch(e => {
				return git.Repository.open(downloadPath);
			});
		return { repository, path: downloadPath };
	}
	async separateByFile(repository) {
		let fileList = [];

		const readFiles = async dir => {
			const readFile = util.promisify(fs.readFile);

			const files = await readdir(dir, { withFileTypes: true });
			if (files) {
				const fz = await Promise.all(
					files.map(async file => {
						if (file.isDirectory()) {
							const recurs = await readFiles(`${dir}/${file.name}`);
							return `finished ${file.name}`;
						}
						const regexFilter = /.js$|.tsx$|ts$/;
						const customFilter = /paths\.js/;
						const filter = customFilter ? customFilter : regexFilter;
						if (!filter.test(file.name)) {
							return `not parsed ${file.name}`;
						} else {
						}
						const read = await readFile(path.join(dir, file.name), {
							encoding: 'utf-8'
						});
						const relativePath =
							dir === repository ? '/' : dir.replace(repository, '') + '/';
						fileList.push({
							text: read,
							name: file.name,
							dir: { absolute: dir, relative: relativePath },
							_id: ObjectId()
						});
						return `finished ${file.name}`;
					})
				).catch(e => {});
			}
			return `${dir} finished`;
		};
		const resultOfRead = await readFiles(repository);
		return fileList;
	}
	parseCode(input) {
		return input;
	}
	parseCodeFromFile(repoPath, filename) {
		return new Promise((resolve, reject) => {
			const file = path.join(repoPath, filename);
			if (file) {
				fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
					resolve({ name: filename, text: data, _id: ObjectId() });
				});
			}
		});
	}
	async createProject(user, repo, files) {
		const existing = await this.findOne({ repo, user });
		const fileMap = new Map(
			files.map(({ name, _id, text, dir }, index) => {
				if (name == 'index.js') {
				}
				return [
					`${dir.relative}${name}`,
					{ _id, text, dir: dir.relative, index, name }
				];
			})
		);
		if (!existing) {
			const fileIds = this.convertFileMapToDbArr(fileMap);
			const { insertedId } = await this.insertOne({ user, repo, fileIds });
			return { _id: insertedId, fileMap };
		}
		existing.fileIds.forEach(({ _id, name }, index) => {
			if (fileMap.has(name)) {
				const mapVal = fileMap.get(name);
				if (_id == null) _id = ObjectId();
				fileMap.set(name, { ...mapVal, _id, index });
			}
		});
		const fileIds = this.convertFileMapToDbArr(fileMap);
		const updated = await this.updateOne({
			filter: { _id: existing._id },
			doc: { $set: { fileIds: fileIds } }
		});
		return { _id: existing._id, fileMap };
	}
	convertFileMapToDbArr(fileMap) {
		const dbArr = [];
		fileMap.forEach(({ _id }, name) => {
			dbArr.push({ _id, name });
		});
		return dbArr;
	}
	createListeners(_id) {
		class CodeEmitter extends EventEmitter {
			constructor() {
				super();
				this.onTaskEnded.bind(this);
				this.allStarted = new Map();
				this.importResult = new Map();
				this.ended = false;
				this.thenable = {
					then: fn => {
						fn('jup');
					}
				};
			}
			emit(type, ...args) {
				this.allStarted.set(args[0], type);
				super.emit(type, ...args);
			}
			endProcess() {
				this.ended = true;
			}
			isEnded() {
				return new Promise((resolve, reject) => {
					this.resolver = () => {
						resolve(this.importResult);
					};
					if (this.ended === true) resolve(this.importResult);
				});
			}
			on(event, fn) {
				const newFn = async (...args) => {
					let error = null;
					const result = await fn(...args).catch(e => {
						error = e;
					});
					this.onTaskEnded(event, ...args, error, result);
				};
				super.on(event, newFn);
			}
			onTaskEnded(type, object, error, result) {
				this.allStarted.delete(object);
				this.importResult.set(
					{ type, name: object.name },
					{ result, error, object }
				);

				if (this.ended || this.allStarted.size == 0) {
					this.endProcess();
					if (this.resolver) this.resolver();
				}
			}
		}

		const codeEmitter = new CodeEmitter();
		const handleError = (type, object) => {};
		codeEmitter.on('class', async c => {
			const { parent, name } = c;
			const found = await this.findOne(
				{ project: _id, parent, name },
				'code.class'
			);
			if (!found) {
				const inserted = await this.insertClass({ ...c, project: _id });
				return inserted;
			}
			const updated = await this.updateClass(found._id, c);
			return updated;
		});
		codeEmitter.on('variable', async v => {
			const { parent, name } = v;
			const found = await this.findOne(
				{ project: _id, parent, name },
				'code.variable'
			);
			if (!found) {
				const inserted = await this.insertVariable({ ...v, project: _id });
				return inserted;
			}
			const updated = this.updateVariable(found._id, v);
			return updated;
		});
		codeEmitter.on('function', async func => {
			const { parent, name } = func;
			const found = await this.findOne(
				{ project: _id, parent, name },
				'code.variable'
			);
			if (!found) {
				const inserted = await this.insertVariable({ ...func, project: _id });
				return inserted;
			}
			const updated = await this.updateVariable(found._id, func);
			return updated;
		});
		codeEmitter.on('file', async f => {
			console.log('started ' + f.key); //, this);
			const updatedFile = await this.updateFile(f._id, { ...f, project: _id });
			return updatedFile;
		});
		codeEmitter.setMaxListeners(30);
		console.log(codeEmitter.getMaxListeners());
		return codeEmitter;
	}
	async updateVariable(_id, updated, opts = { upsert: true }) {
		return this.updateSubclass(
			'code.variable',
			{ filter: { _id }, doc: updated },
			opts
		);
	}
	async insertVariable(insert, opts = {}) {
		return this.insertSubclass('code.variable', insert, opts);
	}

	async updateClass(_id, updated, opts = { upsert: true }) {
		return this.updateSubclass(
			'code.class',
			{ filter: { _id }, doc: updated },
			opts
		);
	}
	async insertClass(insert, opts = {}) {
		return this.insertSubclass('code.class', insert, opts);
	}

	async updateFunction(_id, updated, opts = { upsert: true }) {
		return this.updateSubclass(
			'code.function',
			{ filter: { _id }, doc: updated },
			opts
		);
	}
	async insertFunction(insert, opts = {}) {
		return this.insertSubclass('code.function', insert, opts);
	}

	async insertFile(insert, opts = {}) {
		return this.insertSubclass('code.file', insert, opts);
	}
	async updateFile(_id, updated, opts = { upsert: true }) {
		return this.updateSubclass(
			'code.file',
			{ filter: { _id }, opts, doc: updated },
			opts
		);
	}

	async insertSubclass(type, insert, opts = {}) {
		return this.insertOne({ doc: insert, opts }, type);
	}
	async updateSubclass(type, { doc, filter }, opts = {}) {
		return this.updateById({ filter, doc: { $set: doc }, opts }, type);
	}
	errorHandler(e) {
		return { isError: true, error: e };
	}
}

module.exports = CodeRepository;
