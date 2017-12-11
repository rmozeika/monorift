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
            this.router.post('/', this.retrieveAll.bind(this));              
            this.router.post('/createUser', this.createUser.bind(this));            
          }) 
    }

    retrieveAll(req, res) {
        var accessGroups = 'sysadmin';
        if (!this.checkPermission({ req, res }, accessGroups)) return;
        
        this.repository.findAll((err, data) => {
            res.send(data);
        });        
    }

    createUser(req, res) {
        var accessGroups = 'sysadmin';
        if (!this.checkPermission({ req, res }, accessGroups)) return;

        const { username, password, privledges } = req.body;
        const user = Object.assign({}, { username, password, privledges });
        this.repository.createUser(user, (err, data)=> {
            if (err) throw err;
            res.send(data);
        });
    }
}

module.exports = UserRoute;
