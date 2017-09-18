const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

const {ObjectID} = require('mongodb')

var id = '59be61dd91aaa02f40172f0211'
var usr_id = '59bd87cf2be1c11f9c292b97'

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({
//   _id:id
// }).then((todos) => {
//
//   console.log('Todos ', todos)
// })
//
// Todo.findOne({
//   _id:id
// }).then((todo) => {
//
//   console.log('Todo ', todo)
// })

// Todo.findById(id).then((todo => {
//     if (!todo) {
//
//       console.log('id not found')
//     }
//     console.log('Todo by id ', todo)
// })).catch((e) => console.log(e));

User.findById(usr_id).then((todo => {
    if (!todo) {

      return console.log('user not found')
    }
    console.log('User by id ', todo)
})).catch((e) => console.log(e));
