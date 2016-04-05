
//load the Client interface
var MongoClient = require('mongodb').MongoClient;
// the client db connection scope is wrapped in a callback:
var url = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
console.log(url);
// MongoClient.connect('mongodb://'+connection_string, function(err, db) {
//   if(err) throw err;
//   var collection = db.collection('books').find().limit(10).toArray(function(err, docs) {
//     console.dir(docs);
//     db.close();
//   })
// })
