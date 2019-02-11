const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  is_admin: {
    type: Boolean
  },
  age: {
    type: Number
  }
});

module.exports = mongoose.model('User', UserSchema);
