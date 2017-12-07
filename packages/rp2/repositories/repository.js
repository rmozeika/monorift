const extendedMethods = ['find', 'findOne', 'insert', 'delete'];

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

    getExtendedMethodNames() {
      return extendedMethods;
    }
}

module.exports = Repository;