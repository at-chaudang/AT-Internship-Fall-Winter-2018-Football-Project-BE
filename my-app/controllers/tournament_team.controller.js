const tournamentTeamService = require('../services/tournament_team.service');

module.exports = {
  index: (req, res) => {
    const id = req.params.id;
    tournamentTeamService.selectAll(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    tournamentTeamService.getTeamsByTournamentId(id, (err, callback) => {
      if (err) res.json(404);
      res.json(callback);
    });
  }
}
