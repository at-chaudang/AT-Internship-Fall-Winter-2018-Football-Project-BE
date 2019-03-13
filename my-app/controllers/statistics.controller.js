const statisticsService = require('../services/statistics.service');

module.exports = {
  index: (req, res) => {
    statisticsService.statisticMatch((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  }
}
