const jwt = require('jsonwebtoken');

// Verify Token
module.exports = function(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1];
    jwt.verify(token, 'secretKey', (error) => {
      if (error) throw error;
      // Next middileware
      next();
    });
  } else {
    res.sendStatus(403);
  }
}
