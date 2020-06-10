const { ObjectId, MongoClient } = require('mongodb');
const util = require('util');

const {
	mongoConnectionString: uri,
	mongoUser,
	mongoPassword
} = require('../config.js');

// Mongodb methods to be extended to repository
//
// Options:
//  - combine:  create "one or many" methods (e.g. insertOne, insertMany)
//  - attach:   run function after
const extendMethods = [
	{
		name: 'update',
		combine: true
	},
	{
		name: 'find',
		suffixes: ['One']
	},
	{
		name: 'find',
		attach: 'toArray'
	},
	{
		name: 'insert',
		combine: true,
		resolve: data => {
			if (Array.isArray(data)) return 'Many';
			return 'One';
		}
	},
	{
		name: 'delete',
		combine: true
	},
	{
		name: 'findOneAndUpdate'
	}
];

class MongoService {
	constructor() {
		// this.connectToServer();
		// this.createMethods(extendMethods);
	}

	connectToServer(cb) {
		const options = {
			authMechanism: 'SCRAM-SHA-1',
			authSource: 'admin',
			useUnifiedTopology: true // for deprecation warning
		};
		// options['auth.user'] = mongoUser;
		// options['auth.password'] = mongoPassword;
		console.log('connecting to mongo');
		const MonoriftClient = new MongoClient(uri, options);
		MonoriftClient.connect()
			.then(async client => {
				this.createMethods(extendMethods);

				this._db = client.db('data');
				return cb(null, client);
			})
			.catch(e => {
				console.log('error connecting', e);
				process.exit(22);
			});
	}

	getDb() {
		return this._db;
	}
	getMethodNames() {
		let methodNames = [];
		extendMethods.forEach(method => {
			if (!method.suffixes) method.suffixes = [''];
			methodNames = methodNames.concat(
				method.suffixes.map(suffix => method.name + suffix)
			);
			if (method.combine) methodNames.push(method.name);
		});

		return methodNames;
	}

	createMethods(extendMethods) {
		extendMethods.forEach(method => {
			if (method.combine) {
				method.suffixes = ['One', 'Many'];
			}
			if (!method.suffixes) {
				method.suffixes = [''];
			}
			const opts = {
				resolve: method.resolve,
				attach: method.attach,
				combine: method.combine,
				defaultMethod: method.defaultMethod
			};
			this._createMethods(method.name, method.suffixes, opts);
		});
	}

	_createMethods(method, suffixes, { resolve, attach, combine, defaultMethod }) {
		// let initialValue
		const methods = suffixes.reduce((acc, suffix) => {
			const operation = (collection, obj = {}, cb) => {
				const args = this.parseArguments(obj);
				var func = LogCallback(method, suffix, cb);
				var collection = this._db.collection(collection);

				if (attach) {
					const applier = collection[method + suffix].apply(collection, args);
					if (cb) {
						applier[attach](func);
					} else {
						const attachAsync = async () => {
							const res = await collection[method + suffix].apply(collection, args);

							return res[attach]();
						};
						return attachAsync(); //[attach];
					}
				} else {
					if (!cb) {
						const [filter, doc] = args;
						// return collection[method + suffix](filter, doc);
						return collection[method + suffix].apply(collection, args);
					} else {
						args.push(func);
						collection[method + suffix].apply(collection, args);
					}
				}
			};
			this[method + suffix] = operation;
			acc[suffix] = operation;
			return acc;
		}, {});
		if (resolve) {
			this[method] = (collection, obj = {}, cb) => {
				const resolvedSuffix = resolve(obj);
				return methods[resolvedSuffix](collection, obj, cb);
			};
		}
		if (defaultMethod) {
			this[method] = methods[defaultMethod];
		}
	}
	parseArguments(obj) {
		const { filter, doc, opts } = obj;
		if (!doc) return [obj];
		const filterId = filter && filter._id && ObjectId(filter._id);
		const filterWithId = filterId
			? {
					...filter,
					_id: filterId
			  }
			: filter;
		const args = [filterWithId, doc, opts];
		return args.filter(o => o);
	}
}

function LogCallback(method, suffix, cb) {
	return (fn = (err, res) => {
		console.log(`Mongodb Operation - ${method + suffix}:
Result:
${util.inspect(res, false, null)}
`);
		cb(err, res);
	});
}

module.exports = MongoService;
