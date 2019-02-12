const tournamentService = require('../services/tournament.service');

module.exports = {
  index: (req, res) => {
    tournamentService.selectAll((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    tournamentService.createTournament(req, (err, callback) => {
      if (err) throw err;
      res.redirect('/api/matches/create?data=' + JSON.stringify(callback));
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    tournamentService.getTournament(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  update: (req, res) => {
    const id = req.params.id;
    tournamentService.updateTournament(id, req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  delete: (req, res) => {
    const id = req.params.id;
    tournamentService.deleteTournament(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  }
}
