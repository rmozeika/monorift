const MongoClient = require('mongodb').MongoClient;
const uri = require('../config.json').mongoConnectionString;
//TODO: create special attach functions
// Mongodb methods to be extended to repository
//
// Options:
//  - combine:  if method is "one or many" (insertOne, insertMany),
//              create one repository function 'insert'
const extendMethods = [
    {
      name: 'find',
      suffixes: [
        '',
        'One'
      ],
      attach: {
          indexes: [0],
          runAfter: 'toArray' 
      }
    },
    {
      name: 'insert',
      combine: true
    },
    {
      name: 'delete',
      combine: true
    },
];

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
            if (method.combine) {
                method = method.name;
                this._createOneManyMethod(method.name);
            } else if (method.suffixes && method.suffixes.length) {
                this._createMethods(method.name, method.suffixes)
            } else {
                this._createMethods(method.name, [''])
            }    
        });
    }

    _createMethods(method, suffixes) {
        suffixes.forEach(suffix=> {
            this[method + suffix] = (collection, obj, cb) => {
                this._db.collection(collection)[method + suffix](obj, function(err, res) {
                    console.log(`Mongodb Operation - ${method + suffix}: ${res} `);
                    cb(err, res)
                });
            }
        });
    }

    _createOneManyMethod(method) {
        this[method] = (collection, obj, cb) => {
            if (Array.isArray(obj)) {
                this._db.collection(collection)[method + 'Many'](obj, function(err, res) {
                    console.log(`Mongodb Operation - ${method} - many: ${resj} `);
                    cb(err, res)
                });
            } else {
                this._db.collection(collection)[method + 'One'](obj, function(err, res) {
                    console.log(`Mongodb Operation - ${method} - one: ${res} `);
                    cb(err, res)
                });
            }   
        }
    }
}

module.exports = MongoService;