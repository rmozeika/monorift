const MongoClient = require('mongodb').MongoClient;
const uri = require('../config.js').mongoConnectionString;

function LogCallback(method, suffix, cb) {
    return fn = (err, res) => {
        console.log(`Mongodb Operation - ${method + suffix}: ${res} `);
        cb(err, res)
    };
}
// Mongodb methods to be extended to repository
//
// Options:
//  - combine:  create "one or many" methods (e.g. insertOne, insertMany)
//  - attach:   run function after
const extendMethods = [
    {
        name: 'update',
        combine: true,
    },
    {
      name: 'find',
      suffixes: [
        'One',
      ]
    },
    {
        name: 'find',
        attach: 'toArray'
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
        // this.connectToServer();
        this.createMethods(extendMethods);
    }

    connectToServer(cb) {
        MongoClient.connect(uri, function(err, db) {
            if (err) { throw (err); }
            this._db = db
            return cb(err, db);
        }.bind(this));
    }

    getDb() {
        return this._db;
    }

    getMethodNames() {
        let methodNames = [];
        extendMethods.forEach(method=>{
            if (!method.suffixes) method.suffixes = [''];
            methodNames = methodNames.concat(method.suffixes.map(suffix=> method.name + suffix));
        });

        return methodNames;
    }

    createMethods(extendMethods) {
        extendMethods.forEach(method => {
            if (method.combine) {
                method.suffixes = ['One', 'Many'];
            } 
            if (!method.suffixes) {
                method.suffixes = [''];
            }
            
            this._createMethods(method.name, method.suffixes, method.attach)  
        });
    }

    _createMethods(method, suffixes, attach) {
        suffixes.forEach((suffix, suffixIndex)=> {
            this[method + suffix] = (collection, obj = {}, cb) => {
                let args = [obj];
                if (arguments.length > 3) {
                    args = Array.prototype.slice.call(arguments, 1, arguments.length - 2);
                    obj = arguments.length - 2;
                    cb = arguments.length - 1;
                }
                var func = LogCallback(method, suffix, cb)
                var collection = this._db.collection(collection);
                
                if (attach) {
                    const applier = collection[method + suffix].apply(collection, args);
                    applier[attach](func);                    
                } else {
                    args.push(func);                    
                    collection[method + suffix].apply(collection, args);
                }

            } 
        });
    }
}

module.exports = MongoService;