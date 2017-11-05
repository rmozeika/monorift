var express = require('express');
var router = express.Router();

var Route = require('./route.js');

const routeName = '/users';
const repoName = 'user';

class UserRoute extends Route {
    constructor(api) {
        super(api, routeName, repoName);
        setImmediate(() => {
            this.router.get('/getAll', this.getAll.bind(this));  
            this.router.post('/createUser', this.createUser.bind(this));
          }) 
    }

    getAll(req, res) {
        this.repository.findAll((err, data) => {
            res.send(data);
        });
    }

    createUser(req, res) {
        // const user = req.body;
        // this.mongoInstance.find(this.collection, user, (err, data) => {
        //     if (err) throw err;
        //     res.send(data);
        // })
    }
}

module.exports = UserRoute;
