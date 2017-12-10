var MongoUtil = require('./data-service/mongoUtil.js');
var routes = require('./routes');
var repositories = require('./repositories');
var config = require('./config.js')

class Api {
    constructor() {
        this.repositories = {};
    }

    init(app) {
        this.app = app;
        this._connectMongo();
        this._registerRoutes();
        // this._createRootUser();
    }

    _connectMongo() {
        this.mongoInstance = new MongoUtil();
        this.mongoInstance.connectToServer(this._createRootUser.bind(this));
    }

    _registerRoutes() {
        this._createRepositories();

        Object.keys(routes).forEach(route=> {
            var Route = routes[route];
            var newRoute = new Route(this);
            this.app.use(newRoute.routeName, newRoute.getRouter())
        })
    }

    _createRepositories() {
        Object.keys(repositories).forEach(repo=> {
            var Repository = repositories[repo];
            var newRepo = new Repository(this);
            this.repositories[repo] = newRepo;
        })
    }

    _createRootUser() {
        var rootUser = {
            username: config.rootuser,
            password: config.rootpassword
        }
        this.repositories.users.findByUsername(rootUser.username, (err, user) => {
            if (!user) {
                this.repositories.users.createUser(rootUser, (err, res) => {
                    console.log('created new root user')
                })
            }
        });
    }
}

const api = new Api();
module.exports = api;