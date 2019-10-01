var conn = new Mongo("localhost:27017");
var db = conn.getDB("data");
print(db.getCollectionNames())
// print("hi")
// db['user-repository'].find({}).forEach(function(doc){
// 	printjson(doc)
// })
// printjson()
// cursor = db.users.find();
// while ( cursor.hasNext() ) {
//    printjson( cursor.next() );
// }
