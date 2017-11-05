const express = require('express');


class Route {
    constructor(api, routeName, repoName) {
        this.api = api;
        this.repository = api.repositories[repoName];
        this.routeName = routeName;
        this.router = express.Router();

        setImmediate(() => {
            this.router.get('/', this.get.bind(this));
            this.router.post('/insert', this.insert.bind(this));
            // this.router.post('/deleteOne', this.deleteOne.bind(this));
            // this.router.post('/deleteMany', this.deleteMany.bind(this));
        })
    }
    // automatically add all these routes before proceeding

    
    get(req, res) {
        this.repository.findAll((err, data) => {
            if (err) throw err;
            res.send(data);
        })
    }

    insert(req, res) {
        const data = req.body;
        this.repository.insert(data, (err, data) => {
            res.send(data)
        })
    }


    getRouter() { return this.router; }
}

module.exports = Route;