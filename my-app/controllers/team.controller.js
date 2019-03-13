const TeamService = require('../services/team.service');

module.exports = {
  index: (req, res) => {
    // const id = req.params.id;
    TeamService.selectAll((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    TeamService.createTeam(req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    TeamService.getTeam(id, (err, callback) => {
      if (err) {
        res.json(404);
      };
      res.json(callback);
    });
  },
  update: (req, res) => {
    const id = req.params.id;
    TeamService.updateTeam(id, req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  delete: (req, res) => {
    TeamService.deleteTeam(req.params.id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  }
}
