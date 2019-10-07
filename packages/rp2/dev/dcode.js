// var db = connect('127.0.0.1:27017/data')
// cursor = db.getCollection('code.files').find();
// while ( cursor.hasNext() ) {
//    printjson( cursor.next() );
// }
var conn = new Mongo("localhost:27017");
var db = conn.getDB("data");

function del(repo) {
	db.getCollection(repo).deleteMany({});
}

del('code');
del('code.file');
del('code.class');
del('code.variable');