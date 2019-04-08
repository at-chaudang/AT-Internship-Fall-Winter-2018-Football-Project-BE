const scheduleService = require('../services/schedule.service');

module.exports = {
  setKnockout: (req, res) => {
    scheduleService.setKnockout(req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
}
