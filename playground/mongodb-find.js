// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb server')
  }

  console.log("connected to mongodb server")

  db.collection('Users').find({name: "Owen"}).toArray().then((doc) => {
console.log("todos");
console.log(JSON.stringify(doc, undefined, 2));

  }, (err) => {
    console.log('Unable to fetch todos', err);
  })

//  db.close();

});
