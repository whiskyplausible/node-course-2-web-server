// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb server')
  }

  console.log("connected to mongodb server")

  db.collection('Users').deleteOne({_id:ObjectID("59bd1d054d2e2a27bc0788ca")}).then((result) => {
    console.log(result)
  });

  db.collection('Users').deleteMany({name:"Owen"}).then((result) => {
    console.log(result)
  });

// db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
//   console.log(result)
// })

//  db.close();

});
