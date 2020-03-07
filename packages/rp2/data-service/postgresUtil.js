const { Client } = require('pg');
const { psqlConfig } = require('../config.js');
const { password, host } = psqlConfig;
const client = new Client();
const knex = require('knex');
const config = {
	staging: {
		client: 'pg',
		connection: {
			database: 'monorift',
			user: 'Bobby',
			password,
			host
		}
		// pool: {
		//     min: 2,
		//     max: 10
		// },
		// migrations: {
		// tableName: 'knex_migrations'
		// }
	}
};
const extendMethods = [
	{
		name: 'query'
		// combine: true
	}
];

class PostgresService {
	constructor() {
		// this.connectToServer();
		// this.createMethods(extendMethods);
	}

	async connectToServer(cb) {
		const knexInstance = knex(config.staging);
		this.knex = knexInstance.bind(knexInstance);
		// let testMongoId = '';
		// for (var i = 0; i < 24; i++) {
		//     testMongoId+= 'a'
		// }
		// const userInsert = await this.knex('users').insert({ username: 'knexTesDELETE', 'mongo_id': testMongoId, friends: [] }).catch(e => {
		//     console.log(e);
		// })
		// await client.connect();
		// this.client = client;
		// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
		// console.log(res.rows[0].message) // Hello world!
	}
	async insert(table, user, columns) {
		await client.query('INSERT INTO users(data) VALUES($1)', [newUser]);
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
	_createMethods(method, suffixes, attach) {
		suffixes.forEach((suffix, suffixIndex) => {
			this[method + suffix] = (collection, obj = {}, cb) => {
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
		});
	}
}

module.exports = PostgresService;
