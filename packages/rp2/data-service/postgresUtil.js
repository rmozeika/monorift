const { Client } = require('pg');
const { psqlConfig } = require('../config.js');
const { password, host, port, user } = psqlConfig;
const client = new Client();
const knex = require('knex');
const config = {
	staging: {
		client: 'pg',
		connection: {
			database: 'monorift',
			user,
			password,
			host,
			port
		}
	}
};
const extendMethods = [
	{
		name: 'query'
	}
];

class PostgresService {
	constructor() {}

	async connectToServer(cb) {
		const knexInstance = knex(config.staging);
		this.knex = knexInstance.bind(knexInstance);
		this.client = knexInstance;
	}
	async insert(table, user, columns) {
		await client.query('INSERT INTO users(data) VALUES($1)', [newUser]);
	}
	buildWhereQueryValues(query) {
		const queryFields = {
			whereIn: {
				// column: null,
				// values: null,
			},
			where: {}
		};
		Object.entries(query).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				queryFields.whereIn = { column: key, values: value };
				return;
			}
			queryFields.where[key] = value;
		});
		return queryFields;
	}
	whereQueryBuilder(queryFields = {}, { useOr = false } = {}) {
		// const { useOr = false } = opts;
		return function(builder) {
			let querier = builder;
			const { column, values } = queryFields.whereIn;
			if (column && values) {
				querier = builder.whereIn(column, values);
			}
			const queryField = queryFields.where;
			if (Object.keys(queryField).length > 0) {
				if (useOr) {
					Object.entries(queryField).forEach(([key, value]) => {
						querier = querier.orWhere(key, value);
					});
					// querier = querier.andWhere(queryFields.where);
				} else {
					querier = querier.andWhere(queryField);
				}
			}
			return querier;
		};
	}
	createMethods(extendMethods) {
		extendMethods.forEach(method => {
			if (method.combine) {
				method.suffixes = ['One', 'Many'];
			}
			if (!method.suffixes) {
				method.suffixes = [''];
			}

			this._createMethods(method.name, method.suffixes, method.attach);
		});
	}
	setupUsers() {
		this.knex.schema
			.createTableIfNoneExists('users', function(table) {
				table.increments('id');
				table.text('username');
				table.specificType('mongod_id', 'char(24)');
				table.specificType('friends', 'INT[]');
			})
			.then(() => {
				knex('users');
			});
	}
}

module.exports = PostgresService;
