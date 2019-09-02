var Repository = require('./repository.js');

const collection = 'user-repository';

class UserRepository extends Repository {
    constructor(api) {
        super(api, collection);
        this.findByUsername.bind(this);
    }

    createUser(user, cb) {
        this.mongoInstance.insertOne(this.collection, user, cb);
    }

    async findByUsername(username, cb) {
        // if (!cb) {
        //     // const user = await this.findOne({ username });
        //     const user = await this.findOne({username});
        //     return user;
        // } else {
            return this.findOne({username}, cb);
        // }
    }
    async findByUsernameAsync(username) {
        const user = await this.findOne({username});
        return user;    }
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
