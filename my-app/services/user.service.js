const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

module.exports = {
  selectAllUser: (callback) => {
    User.find(callback);
  },
  createUser: (body, callback) => {
    const user = new User(body);
    user.save(callback);
  },
  getUser: (id, callback) => {
    User.find({_id: id}, callback);
  },
  comparePassword: (user, password) => {
    return bcrypt.compareSync(password, user.hash_password);
  },
  updateUser: (id, body, callback) => {
    User.findByIdAndUpdate(id, body, callback);
  },
  deleteUser: (id, callback) => {
    User.deleteOne({_id: id}, callback);
  }
}
