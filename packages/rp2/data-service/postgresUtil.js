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
}

module.exports = PostgresService;
