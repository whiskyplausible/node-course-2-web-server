// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb server')
  }

  console.log("connected to mongodb server")

  db.collection("Users").findOneAndUpdate({
    _id: new ObjectID("59bd1d67f1639b04acdf5f21")}, {
      $set: {
      name:"Owen"}}, {
        returnOriginal: false
      }

    ). then((result) => {
console.log(result)

    })

    db.collection("Users").findOneAndUpdate({
      _id: new ObjectID("59bd1d67f1639b04acdf5f21")}, {
        $inc: { age: 1}}, {
          returnOriginal: false
        }

      ). then((result) => {
  console.log(result)

      })
//  db.close();

});
