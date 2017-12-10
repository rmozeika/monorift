const extendedMethods = ['find', 'findOne', 'insertOne', 'insertMany', 'deleteOne', 'deleteMany'];

class Repository {
    constructor(api, collection) {
      this.api = api;
      this.collection = collection;

      this.mongoInstance = api.mongoInstance;

      this.extendMethods();
    }
    // automatically add all these routes before proceeding
    extendMethods() {
      extendedMethods.forEach(method => {
        this[method] = (object, cb) => {
          this.mongoInstance[method](this.collection, object, cb)
        }        
      })
    }
    
    findAll(cb) {
      this.mongoInstance.find(this.collection, {}, cb);
    }

    findById(_id, cb) {
      const {ObjectId} = require('mongodb'); // or ObjectID 
      const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;
      this.mongoInstance.findOne(this.collection, {_id: safeObjectId(_id)}, cb)
    }

    getExtendedMethodNames() {
      return extendedMethods;
    }
}

module.exports = Repository;