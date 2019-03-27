const homeService = require('../services/home.service');

module.exports = {
  index: (req, res) => {
    homeService.getLatestResultOfMatch((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
}
