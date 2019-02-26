const tournamentTeamService = require('../services/tournament_team.service');

module.exports = {
  show: (req, res) => {
    const id = req.params.id;
    tournamentTeamService.getTeamsByTournamentId(id, (err, callback) => {
      if (err) res.json(404);
      res.json(callback);
    });
  }
}
