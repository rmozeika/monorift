const MongoClient = require('mongodb').MongoClient;

const test = async () => {
    const client = await MongoClient.connect('mongodb://localhost:27017/data');
    const db = client.db('data');
    const collection = db.collection('user-repository');
    const users = await collection.find({});
    const userArray = await users.toArray();
    console.log(userArray)
}
test();
// MongoClient.connect(uri).then((client) => {
//     const db = client.db('data');
//     const collection = db.collection('user-repository');

//     collection.find({})
//     // return cb(null, client.db)
// })