var express = require('express');
var router = express.Router();

var Route = require('./route.js');

const routeName = '/users';
const repoName = 'users';

class UserRoute extends Route {
    constructor(api) {
        super(api, routeName, repoName);
        setImmediate(() => {
            this.router.get('/', this.retrieveAll.bind(this));  
            this.router.post('/createUser', this.createUser.bind(this));            
          }) 
    }

    retrieveAll(req, res) {
        this.repository.findAll((err, data) => {
            res.send(data);
        });
    }

    createUser(req, res) {
        const newUser = req.body;
        this.repository.createUser(newUser, (err, data)=> {
            if (err) throw err;
            res.send(data);
        });
    }
}

module.exports = UserRoute;
