const userService = require('../services/user.service');

module.exports = {
  index: (req, res) => {
    userService.selectAllUser((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    userService.createUser(req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    userService.getUser(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  update: (req, res) => {
    const id = req.params.id;
    userService.updateUser(id, req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  delete: (req, res) => {
    userService.deleteUser(req.params.id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  }
}
