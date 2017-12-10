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
        //protect these by system-admin
        return (req, res) => {
            if (req.user && req.user.privledges === 'sysadmin') {
                const query = req.body;
                this.repository[method](query, (err, data)=> { 
                    if (err) throw err;
                    res.json(data);
                });
            } else {
                res.redirect('/login');
            }
        }
    }

    getRouter() { return this.router; }
}

module.exports = Route;