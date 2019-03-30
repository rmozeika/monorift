const extendedMethods = ['find', 'findOne', 'insertOne', 'insertMany', 'deleteOne', 'deleteMany', 'updateOne', 'updateMany'];

class Repository {
    constructor(api, collection) {
      this.api = api;
      this.collection = collection;

      this.mongoInstance = api.mongoInstance;

      this.extendMethods();
    }

    extendMethods() {
      this.mongoInstance.getMethodNames().forEach(method => {
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
      if (cb) {
        this.mongoInstance.findOne(this.collection, {_id: safeObjectId(_id)}, cb);
      }
      return this.mongoInstance.findOne(this.collection, {_id: safeObjectId(_id)})
    }

    update(_id, obj, cb) {
      return this.mongoInstance.update(this.collection, {_id: safeObjectId(_id)}, obj);
    }

    getExtendedMethodNames() {
      return this.mongoInstance.getMethodNames();
    }
}

module.exports = Repository;