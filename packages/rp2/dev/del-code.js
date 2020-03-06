var conn = new Mongo('localhost:27017');
var db = conn.getDB('data');
print(db.getCollectionNames());
