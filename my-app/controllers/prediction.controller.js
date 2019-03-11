const predictionService = require('../services/prediction.service');

module.exports = {
  index: (req, res) => {
    predictionService.selectAll((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    predictionService.createPrediction(req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    predictionService.getAllPrediction(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  top: (req, res) => {
    const id = req.params.id;
    predictionService.getTopPredictionUser(id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  showByIdMatch: (req, res) => {
    const match_id = req.params.id;
    predictionService.getPredictionByIdMatch(match_id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  update: (req, res) => {
    const id = req.params.id;
    predictionService.updatePrediction(id, req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  delete: (req, res) => {
    predictionService.deletePrediction(req.params.id, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  deleteByUser: (req, res) => {
    predictionService.deletePredictionByUser(req.params.id, (err, callback) => {
      if (err) throw err;
      res.json(402);
    });
  }
}
