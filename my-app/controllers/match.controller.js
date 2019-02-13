const matchService = require('../services/match.service');

module.exports = {
  index: (req, res) => {
    matchService.selectAll((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    matchService.createMatch(req.query, (err, callback) => {
      if (err) throw err;
      res.json(200);
    });
  },
  show: (req, res) => {
    const id = req.params.id;    
    matchService.getMatch(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  },
  showAllByTournament: (req, res) => {
    const tournamentId = req.params.tournamentId;
    matchService.getAllByTournament(tournamentId, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  },
  showBracketByTournament: (req, res) => {
    const tournamentId = req.params.tournamentId;
    matchService.getBracketByTournament(tournamentId, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  },
  update: (req, res) => {
    matchService.updateMatch(req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  },
  delete: (req, res) => {
    matchService.deleteMatch(req.params.id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    })
  }
}
