const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {todos, populateTodos, users, populateUsers} = require('./seed/seed')
const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {

  it('should create a new todo', (done) => {

    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}). then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  })

  it('should not create todo with invalid body data,', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find(). then((todos) => {
          expect(todos.length).toBe(2);

          done();
        }).catch((e) => done(e));
      })

  })
})

describe('GET /todos', () => {

  it('should get all todos', (done) => {

    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);

      })
      .end(done);
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done);

  })
})

  describe('GET /todos/:id', () => {
    it('should not  return todo doc created by other user', (done) => {
      request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);

    })

  it('should return 404 if todo not found', (done) => {
    var newID = new ObjectID()
    request(app)
      .get(`/todos/${newID.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if invalid ID', (done) => {
    var newID = "12345"
    request(app)
      .get(`/todos/${newID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });


})


describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);

    })
    .end((err, res) => {

      if (err) {
        return done(err);
      }

      Todo.findById(hexId).then((todoFound) =>
      {
        expect(todoFound).toBe(null);
        done();
      }).catch((e) => done(e));
    }
    )

  })

  it('should remove a todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(204)

    .end((err, res) => {

      if (err) {
        return done(err);
      }

      Todo.findById(hexId).then((todoFound) =>
      {
        expect(todoFound).toExist();
        done();
      }).catch((e) => done(e));
    }
    )

  })


  it('should return 404 if todo not found', (done) => {
    var newID = new ObjectID()``
    request(app)
      .delete(`/todos/${newID.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);

  })

  it('should return 404 if objet id is invalid', (done) => {

    var newID = "12345"
    request(app)
      .delete(`/todos/${newID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  })

})


describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
          text: "this is now updated text",
          completed: true })
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe("this is now updated text");
          expect(res.body.todo.completed).toBe(true);
          //expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

  })

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
          completed: false })
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBe(null);
      })
      .end(done);
  })



})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)

  })
  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)

  })


})

describe('POST /users/', () => {
  it('should create a user', (done) => {
      var email = 'example@example.com'
      var password = '123bnm!'
      request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
          //res.headers['x-auth'].should.exist();
          expect(res.headers['x-auth']).toExist();
          expect(res.body._id).toExist();
          expect(res.body.email).toBe(email);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          User.findOne({email}).then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          }).catch((e) => done(e));

        })
        })


  it('should return validation errors if request invalid', (done) => {
    var email = "thisisinvalidemail"
    var password = "inv"
    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)
})

   it('should not create user if email in use', (done) => {
     var email = "andrew@example.com"
     var password = "thisisvalidpassword"
     request(app)
       .post('/users')
       .send({email,password})
       .expect(400)
       .end(done)

 })

})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({   email:users[1].email,
                password: users[1].password
              })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();


      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          })
          done();
        }).catch((e) => done (e));
      })
  })

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({   email:users[1].email,
                password: "wrong password"
              })
      .expect(400)
      // .expect((res) => {
      //   expect(res.headers['x-auth']).toNotExist();


      // })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toNotExist()
          done();
        }).catch((e) => done (e));
      })
  })

})

describe('DELETE /users/me/token', () => {

  it('should remove auth token on logout ', (done => {
      request(app)
        .delete('/users/me/token')
        .set("x-auth",users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
          User.findById(users[0]._id).then((user) => {
            //console.log("*****",user.tokens[0])
            expect(user.tokens[0]).toNotExist()
            done();
          }).catch((e) => done (e))

        })

    })
)


    // DELETE request to users me token
    // set x-auth equal to token
    // find user, verify that tokens area has length of 0

  }
)
