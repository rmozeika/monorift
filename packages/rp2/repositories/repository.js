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

class Repository {
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

	// defaults to andWhere
	async query(query = {}, select = '*') {
		const queryFields = this.postgresInstance.buildWhereQueryValues(query);

		const data = await this.postgresInstance
			.knex(this.table)
			.where(this.postgresInstance.whereQueryBuilder(queryFields))
			.select(select);

		return data;
	}
	// 'orWhere' instead of queries default 'andWhere'
	async queryMatching(query = {}, select = '*') {
		const queryFields = this.postgresInstance.buildWhereQueryValues(query);

		const data = await this.postgresInstance
			.knex(this.table)
			.where(this.postgresInstance.whereQueryBuilder(queryFields, { useOr: true }))
			.select(select);

		return data;
	}
	async update(user, doc, opts = {}) {
		const operations = {};
		if (this.collection) {
			let filter = this.Model.convertToMongo(user);
			let data = this.Model.convertToMongo(doc);
			const mongoOp = await this.updateMany({
				filter,
				doc: { $set: data },
				opts
			}).catch(e => {
				console.log(e);
			});
			operations.mongo = mongoOp;
		}
		if (this.table) {
			let filter = user;
			let data = doc;
			if (this.Model) {
				filter = this.Model.convertToPg(user);
				data = this.Model.convertToPg(doc);
				console.log(user);

				// const userModel = new this.Model.(filter, this);
				// // const userData = await userModel;
				// data = userModel.mapPg();
			}
			const pgOp = await this.updateRow(filter, data);
			operations.pg = pgOp;
		}
		return operations;
	}
	async updateRow(where, data) {
		const op = await this.postgresInstance
			.knex(this.table)
			.where(where)
			.update(data);
		return op;
	}
	extendMethods() {
		this.mongoInstance.getMethodNames().forEach(method => {
			this[method] = (object, subcollection, opts, cb) => {
				return new Promise((resolve, reject) => {
					return this.mongoInstance[method](subcollection || this.collection, object) //{collection: this.collection, ...object})
						.then(result => {
							if (cb) return cb(result);
							resolve(result);
						});
				});
			};
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

	findAll(cb) {
		return new Promise((resolve, reject) => {
			if (cb) {
				this.mongoInstance.find(this.collection, {}, cb);
			} else {
				this.mongoInstance.find(this.collection, {}).then(result => {
					resolve(result);
				});
			}
		});
	}

	findById(_id, cb) {
		const { ObjectId } = require('mongodb'); // or ObjectID
		const safeObjectId = s => (ObjectId.isValid(s) ? new ObjectId(s) : null);
		if (cb) {
			this.mongoInstance.findOne(this.collection, { _id: safeObjectId(_id) }, cb);
		}
		return this.mongoInstance.findOne(this.collection, {
			_id: safeObjectId(_id)
		});
	}

	updateById(_id, obj, subcollection, cb) {
		return this.mongoInstance.update(
			subcollection || this.collection,
			{ _id: safeObjectId(_id) },
			obj
		);
	}
	// updateById(_id, obj, subcollection, cb) {
	//   return this.mongoInstance.update(subcollection || this.collection, {_id: safeObjectId(_id)}, obj);
	// }
	getExtendedMethodNames() {
		return this.mongoInstance.getMethodNames();
	}
}

module.exports = Repository;
