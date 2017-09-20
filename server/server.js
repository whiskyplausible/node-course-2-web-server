require('./config/config')

var express = require('express')
var bodyParser = require('body-parser')
var _ = require('lodash')

var {authenticate} = require('./middleware/authenticate')
var {mongoose} = require('./db/mongoose.js')
var {Todo} = require('./models/todo.js')
var {User} = require('./models/user.js')
const {ObjectID} = require('mongodb')
var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc);

  }, (e) => {

    res.status(400).send(e);

  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);

  })

})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {

    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});

  },(e) => {
    res.status(400).send();
  })
})

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  })
})

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
if (!todo) {
  return res.status(404).send()
}

res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })

})

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']); // select only email and password fields from form
  var user = new User({ // create new user object containing the relevant information from above
    email:body.email,
    password:body.password
  })

  user.save().then(() => { // take the user object and save it to mongoDB database
    return user.generateAuthToken() // when save has completed generate token
  }).then((token) => { // when token is generated, take the returned token (as argument)
    res.header('x-auth', token).send(user); //send header to use containing token
  }).catch((e) => {
    res.status(400).send(e); //send error if doesn't work - problem here, should be catch, to catch any error in whole promise chain
  })
})



app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})


app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app};
