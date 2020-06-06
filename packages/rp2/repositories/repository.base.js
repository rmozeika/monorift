const extendedMethods = [
	'find',
	'findOne',
	'insertOne',
	'insertMany',
	'deleteOne',
	'deleteMany',
	'updateOne',
	'updateMany',
	'findOneAndUpdate'
];
const v8 = require('v8');

class RepositoryBase {
	constructor(api, subcollections) {
		this.api = api;
		const { collection = null, table = null } = this.constructor.getNamespaces();
		this.collection = collection;
		this.table = table;
		this.mongoInstance = api.mongoInstance;
		this.postgresInstance = api.postgresInstance;
		if (this.table !== null) this.db = this.postgresInstance.knex(this.table);

		this.extendMethods();
	}
	// if overwritten mongo method use _prefix for original
	// e.g. insert() => { ops...; this._insert()}
	extendMethods() {
		this.mongoInstance.getMethodNames().forEach(method => {
			const mongoOp = (object, subcollection, opts, cb) => {
				return new Promise((resolve, reject) => {
					return this.mongoInstance[method](subcollection || this.collection, object) //{collection: this.collection, ...object})
						.then(result => {
							if (cb) return cb(result);
							resolve(result);
						});
				});
			};
			if (this[method]) {
				this[`_${method}`] = mongoOp;
				return;
			}
			this[method] = mongoOp;
		});
	}

	createMethod(object, collection, method, cb) {
		return new Promise((resolve, reject) => {
			return this.mongoInstance[method](collection, object) //{collection: this.collection, ...object})
				.then(result => {
					if (cb) return cb(result);
					resolve(result);
				});
		});
	}
	getExtendedMethodNames() {
		return this.mongoInstance.getMethodNames();
	}
	structuredClone(obj) {
		return v8.deserialize(v8.serialize(obj));
	}
}

module.exports = RepositoryBase;
