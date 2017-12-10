var Repository = require('./repository.js');

const collection = 'user-repository'

class UserRepository extends Repository {
    constructor(api) {
        super(api, collection);
    }

    createUser(user, cb) {
        this.mongoInstance.insertOne(this.collection, user, cb)
    }
}

module.exports = UserRepository;
