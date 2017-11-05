var MongoUtil = require('./data-service/mongoUtil.js');
var routes = require('./routes');
var repositories = require('./repositories');

class Api {
    constructor() {
        this.repositories = {};
    }

    init(app) {
        this.app = app;
        this.connectMongo();
        this.registerRoutes();
    }

    connectMongo() {
        this.mongoInstance = new MongoUtil();
    }

    registerRoutes() {
        this.createRepositories();

        Object.keys(routes).forEach(route=> {
            var Route = routes[route];
            var newRoute = new Route(this);
            this.app.use(newRoute.routeName, newRoute.getRouter())
        })
    }

    createRepositories() {
        Object.keys(repositories).forEach(repo=> {
            var Repository = repositories[repo];
            var newRepo = new Repository(this);
            this.repositories[repo] = newRepo;
        })
    }
}

const api = new Api();
module.exports = api;