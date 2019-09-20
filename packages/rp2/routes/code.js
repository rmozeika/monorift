var express = require('express');
var router = express.Router();
const secured = require('../middleware/secured');
var Route = require('./route.js');

const routeName = '/code';
const repoName = 'code';

class CodeRoute extends Route {
    constructor(api) {
        super(api, routeName, repoName);
        setImmediate(() => {
            // this.router.get('/', secured(), this.clone.bind(this));
            this.router.post('/', this.clone.bind(this));              
            // this.router.post('/createUser', this.createUser.bind(this));
            // this.router.get('/username', this.getUser.bind(this));

          }); 
    }

    clone(req, res) {
        const { repo } = req.data;
        this.repository.clone(repo);
    }

    // createUser(req, res) {
    //     var accessGroups = 'sysadmin';
    //     if (!this.checkPermission({ req, res }, accessGroups)) return;

    //     const { username, password, privledges } = req.body;
    //     const user = Object.assign({}, { username, password, privledges });
    //     this.repository.createUser(user, (err, data)=> {
    //         if (err) throw err;
    //         res.send(data);
    //     });
    // }
    // getUser(req, res) {
    //     const { user} = req;
    //     return res.send(user);
    // }
}

module.exports = CodeRoute;
