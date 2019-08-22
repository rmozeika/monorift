var express = require('express');
var router = express.Router();

var Route = require('./route.js');

const routeName = '/profile';
const repoName = 'profile';

class ProfileRoute extends Route {
    constructor(api) {
        super(api, routeName, repoName);
        setImmediate(() => {
            this.router.get('/', this.getProfile.bind(this));
            // this.router.post('/', this.retrieveAll.bind(this));              
            // this.router.post('/createUser', this.createUser.bind(this));
            // this.router.get('/username', this.getUser.bind(this));

          }) 
    }

    getProfile(req, res) {
        
    }
}

module.exports = UserRoute;
