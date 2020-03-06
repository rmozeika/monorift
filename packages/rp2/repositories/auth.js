var Repository = require('./repository.js');

const collection = 'auth-repository';
// UNUSED
class AuthRepository extends Repository {
	constructor(api) {
		super(api, collection);
	}
}

module.exports = AuthRepository;
