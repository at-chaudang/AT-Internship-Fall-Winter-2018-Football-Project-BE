const scheduleService = require('../services/schedule.service');

module.exports = {
  index: (req, res) => {
    scheduleService.selectAll((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    scheduleService.createSchedule(req.query, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    scheduleService.getSchedule(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  },
  showByTournament: (req, res) => {
    const tournamentId = req.params.tournamentId;
    scheduleService.getScheduleByTournament(tournamentId, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  },
  update: (req, res) => {
    const id = req.params.id;
    scheduleService.updateSchedule(id, req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  },
  delete: (req, res) => {
    scheduleService.deleteSchedule(req.params.id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  }
}
