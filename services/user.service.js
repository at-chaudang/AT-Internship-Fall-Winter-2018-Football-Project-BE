const User = require('../models/user.model');

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
  updateUser: (id, body, callback) => {
    User.findByIdAndUpdate(id, body, callback);
  },
  deleteUser: (id, callback) => {
    User.deleteOne({_id: id}, callback);
  },
  // newAccessToken: (id, token, callback) => {
  //   User.findByIdAndUpdate(id, token, callback);
  // },
  // updateAge: (id, age, callback) => {
  //   User.findByIdAndUpdate(id, {age: age}, callback);
  // },
  // isExistUser: (email) => {
  //   !!User.find(email);
  // }
}
