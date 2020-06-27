const RepositoryBase = require('./repository.base');

class Repository extends RepositoryBase {
	constructor(api, subcollections) {
		super(api, subcollections);
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
	getDataByDb(data) {
		const preMongoData = this.structuredClone(data);
		const prePgData = this.structuredClone(data);
		const result = {
			mongo: false,
			pg: false
		};
		if (this.collection) {
			result.mongo = this.Model
				? this.Model.convertToMongo(preMongoData)
				: preMongoData;
		}
		if (this.table) {
			result.pg = this.Model ? this.Model.convertToPg(prePgData) : prePgData;
		}
		return result;
	}
	async update(toUpdate, doc, opts = {}) {
		const operations = {};
		const filter = this.getDataByDb(toUpdate);
		const data = this.getDataByDb(doc);
		if (filter.mongo && data.mongo) {
			const mongoOp = await this.update({
				filter: filter.mongo,
				doc: { $set: data.mongo },
				opts
			}).catch(e => {
				console.log(e);
			});

			operations.mongo = mongoOp;
			// }
		}

		if (filter.pg && data.pg) {
			const pgOp = await this.updateRow(filter.pg, data.pg);
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
	// overwrite default insert
	async insert(doc, returning) {
		const data = this.getDataByDb(doc);
		const operation = {};
		if (data.mongo) {
			operation.mongo = await this._insert(data.mongo);
		}
		if (data.pg) {
			operation.pg = await this.insertRow(data.pg, returning);
			if (returning) return operation.pg;
		}
		return operation;
	}
	async insertRow(data, returning) {
		let result;
		if (returning) {
			result = await this.postgresInstance
				.knex(this.table)
				.returning(returning)
				.insert(data);
		} else {
			result = await this.postgresInstance.knex(this.table).insert(data);
		}
		return result;
	}
	async del(toDelete) {
		const data = this.getDataByDb(toDelete);
		const operation = {};
		if (data.mongo) {
			operation.mongo = await this._delete(data.mongo);
		}
		if (data.pg) {
			operation.pg = await this.deleteRow(data.pg);
		}
		return operation;
	}
	async deleteRow(where) {
		const result = await this.postgresInstance
			.knex(this.table)
			.where(where)
			.del();
		return result;
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
}

module.exports = Repository;
