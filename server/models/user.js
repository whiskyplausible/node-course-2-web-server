const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
  email:{
      type:String,
      required:true,
      minlength:1,
      trim:true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

})

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject()

  return _.pick(userObject, ['_id','email'])
}

UserSchema.methods.generateAuthToken = function () {
  var user = this; //this will be called from an already populated user object (i.e. with password and username), so this object will be passed on here
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString() // create signiture using user id (obviously not with username/email)
  console.log(this)
  user.tokens.push({access, token})//add the token into this user object array (does this go back into original this, or is it a local copy for this function?)

  return user.save().then((resolve) => { //so this is the main function return will return a promise (that needs to be resolved)?
    console.log("token inside function ", token)
    resolve(token); //the promise will then return this token when complete, maybe done so that we don't get the token until it has been written into the database.
  })

}

var User = mongoose.model('User', UserSchema);
module.exports = {User}
