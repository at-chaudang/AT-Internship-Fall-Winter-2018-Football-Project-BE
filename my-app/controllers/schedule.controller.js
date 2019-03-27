const scheduleService = require('../services/schedule.service');

module.exports = {
  setKnockout: (req, res) => {
    scheduleService.setKnockout(req.body, (err, callback) => {
      if (err) throw err;
      res.redirect('/api/matches/show/5c8b77bcdcbeb01a2437c2ac');
    });
  },
}
