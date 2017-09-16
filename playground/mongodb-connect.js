// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb server')
  }

  console.log("connected to mongodb server")

  // db.collection('Todos').insertOne({
  //     text: "Somethting todo",
  //     completed: false
  //
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // })


  // db.collection('Users').insertOne({
  //
  //     name: "Owen",
  //     age: 30,
  //     location: "UK"
  //
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }
  //   console.log(result.ops[0]._id.getTimestamp())
  // })

  db.close();

});
