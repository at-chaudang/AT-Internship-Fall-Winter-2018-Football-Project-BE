const matchService = require('../services/match.service');

module.exports = {
  index: (req, res) => {
    matchService.selectAll((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    matchService.createMatch(req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    matchService.getMatch(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  update: (req, res) => {
    const id = req.params.id;
    matchService.updateMatch(id, req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  delete: (req, res) => {
    matchService.deleteMatch(req.params.id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  }
}
