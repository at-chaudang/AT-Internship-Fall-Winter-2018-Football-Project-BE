const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  },
  is_admin: {
    type: Boolean
  },
  age: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
