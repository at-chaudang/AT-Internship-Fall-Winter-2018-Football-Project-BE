const predictionService = require('../services/prediction.service');

module.exports = {
  index: (req, res) => {
    predictionService.selectAll((err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
  },
  new: (req, res) => {
    console.log(req.body)
    try{
    predictionService.createPrediction(req.body, (err, callback) => {
      if (err) throw err;
      res.json(callback);
    });
    } catch (err) {
      console.log(err);
    }
    
  },
  show: (req, res) => {
    const id = req.params.id;
    predictionService.getPrediction(id, (err, callback) => {
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
  }
}
