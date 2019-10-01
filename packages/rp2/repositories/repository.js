const extendedMethods = ['find', 'findOne', 'insertOne', 'insertMany', 'deleteOne', 'deleteMany', 'updateOne', 'updateMany', 'findOneAndUpdate'];

class Repository {
    constructor(api, collection, subcollections) {
      this.api = api;
      this.collection = collection;

      this.mongoInstance = api.mongoInstance;

      this.extendMethods();
    }

    extendMethods() {
      this.mongoInstance.getMethodNames().forEach(method => {
        this[method] = (object, subcollection, opts, cb) => {
          return new Promise((resolve, reject) => {
            return this.mongoInstance[method](subcollection || this.collection, object)//{collection: this.collection, ...object})
              .then(result =>{
                if (cb) return cb(result);
                resolve(result);
              });
          });
        };
      });
    }
    createMethod(object, collection, method, cb) {
      return new Promise((resolve, reject) => {
        return this.mongoInstance[method](collection, object)//{collection: this.collection, ...object})
          .then(result =>{
            if (cb) return cb(result);
            resolve(result);
          });
      })
    }
    findAll(cb) {
      return new Promise((resolve, reject) => {
        if (cb) {
          this.mongoInstance.find(this.collection, {}, cb);
        } else {
          this.mongoInstance.find(this.collection, {}).then(result => {
            resolve(result);
          })
        }
      });
      
    }

    findById(_id, cb) {
      const {ObjectId} = require('mongodb'); // or ObjectID 
      const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
      if (cb) {
        this.mongoInstance.findOne(this.collection, {_id: safeObjectId(_id)}, cb);
      }
      return this.mongoInstance.findOne(this.collection, {_id: safeObjectId(_id)})
    }

    update(_id, obj, subcollection, cb) {
      return this.mongoInstance.update(subcollection || this.collection, {_id: safeObjectId(_id)}, obj);
    }

    getExtendedMethodNames() {
      return this.mongoInstance.getMethodNames();
    }
}

module.exports = Repository;