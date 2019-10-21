var Repository = require('./repository.js');

const collection = 'user-repository';

class UserRepository extends Repository {
    constructor(api) {
        super(api, collection);
        this.findByUsername.bind(this);
    }

    createUser(user, cb) {
        return this.mongoInstance.insertOne(this.collection, user, cb);
    }

    async findByUsername(username, cb) {
        return this.findOne({username}, cb);
    }
    importProfile(profile, cb) {
        const { email, username, nickname } = profile;
        const obj = {
            email,
            username: nickname,
            src: profile
        };
        return this.createUser(obj, cb);
    }
}

module.exports = UserRepository;
