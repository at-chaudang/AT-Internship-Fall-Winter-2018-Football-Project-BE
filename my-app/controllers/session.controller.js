const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

module.exports = {
  login: (req, res) => {
    // Find the user
    User.findOne({ email: req.body.email, password: req.body.password }, function (err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else {
        const payload = {
          sub: user._id,
          name: user.name,
          admin: user.isAdmin
        }
        jwt.sign(payload, 'secretKey', { expiresIn: '3 days' }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      }
    })
  }
}
