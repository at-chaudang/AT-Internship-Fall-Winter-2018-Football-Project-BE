const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/user.service');

const User = require('../models/user.model');

module.exports = {
  login: (req, res) => {
    // Find the user
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) throw err;
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        if (!userService.comparePassword(user, req.body.password)) {
          res.json({ message: 'Authentication failed. Wrong password.' });
        } else {
          const payload = {
            sub: user._id,
            name: user.name,
            admin: user.is_admin
          }
          jwt.sign(payload, 'secretKey', { expiresIn: '3 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
          });
        }
      }
    })
  },
  register: (req, res) => {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) throw err;
      if (user) {
        res.json({
          success: false,
          message: 'User existed yet.'
        });
      } else {
        let newUser = new User({
          email: req.body.email,
          hash_password: bcrypt.hashSync(req.body.password, 10)
        });
        newUser.save(function (err, user) {
          if (err) {
            return res.status(400).send({
              message: err
            });
          } else {
            const payload = {
              sub: user._id,
              name: user.name,
              admin: user.is_admin
            }
            jwt.sign(payload, 'secretKey', { expiresIn: '3 days' }, (err, token) => {
              if (err) throw err;
              res.json({ token });
            });
          }
        });
      }
    });
  }
}
