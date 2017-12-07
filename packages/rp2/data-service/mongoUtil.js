const MongoClient = require('mongodb').MongoClient;
const uri = require('../config.json').mongoConnectionString;

const extendMethods = ['insertOne', 'deleteOne'];

class MongoService {
    constructor() {
        this.connectToServer();
        this.createMethods(extendMethods);
    }

    connectToServer() {
        MongoClient.connect(uri, function(err, db) {
            if (err) { throw (err); }
            this._db = db
            return;
        }.bind(this));
    }

    getDb() {
        return this._db
    }

    find(collection, query, cb) {
        this._db.collection(collection).find(query).toArray((err, result) => {
            cb(err, result);
        });
    }

    createMethods(extendMethods) {
        extendMethods.forEach(method => {
            const oneIdx = method.indexOf('One');
            if ( oneIdx > -1) {
                method = method.substr(0, oneIdx);
                this._createOneManyMethod(method);
            } else {
                this._createMethod(method)
            }    
        });
    }

    _createMethod(method) {
        this[method] = (collection, obj, cb) => {
            this._db.collection(collection)[method](obj, function(err, res) {
                console.log(obj + ' inserted');
                cb(err, res)
            });
        }
    }

    _createOneManyMethod(method) {
        this[method] = (collection, obj, cb) => {
            if (Array.isArray(obj)) {
                this._db.collection(collection)[method + 'Many'](obj, function(err, res) {
                    console.log(obj + ' inserted multiple');
                    cb(err, res)
                });
            } else {
                this._db.collection(collection)[method + 'One'](obj, function(err, res) {
                    console.log(obj + ' inserted');
                    cb(err, res)
                });
            }   
        }
    }
}

module.exports = MongoService;