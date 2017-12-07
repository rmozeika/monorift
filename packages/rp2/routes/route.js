const express = require('express');


class Route {
    constructor(api, routeName, repoName) {
        this.api = api;
        this.repository = api.repositories[repoName];
        this.routeName = routeName;
        this.router = express.Router();
      
        setImmediate(() => {
            this.repository.getExtendedMethodNames().forEach(method=> {
                const route = this.makeRoute(method);
                this.router.post(`/${method}`, route.bind(this));
            });
        })
    }
    
    makeRoute(method) {
        return (req, res) => {
            const query = req.body;
            this.repository[method](query, (err, data)=> { 
                if (err) throw err;
                res.json(data);
            });
        }
    }

    getRouter() { return this.router; }
}

module.exports = Route;