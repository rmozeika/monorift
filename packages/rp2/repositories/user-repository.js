var Repository = require('./repository.js');

const collection = 'user-repository'

class UserRepository extends Repository {
    constructor(api) {
        super(api, collection);
    }

    getAll(req, res) {
        // this.find(this.collection, {}, (err, data) => {
        //     if (err) throw err;
        //     res.send(data);
        // })
    }

    createUser(req, res) {
        const user = req.body;
        this.mongoInstance.find(this.collection, user, (err, data) => {
            if (err) throw err;
            res.send(data);
        })
    }
}

module.exports = UserRepository;
