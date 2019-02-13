const Prediction = require('./../models/prediction.model');

module.exports = {
  selectAll: (callback) => {
    Prediction.find(callback);
  },
  createPrediction: (body, callback) => {
    for (let i = 0; i < 2; i++) {
      let prediction = new Prediction({
        match_id: body.match_id,
        date: body.date,
        user_id: body.user_id,
        score_prediction: body.scorePrediction[i],
        tournament_team_id: body.tournament_team_id[i]
      });
      prediction.save(callback);
    }
  },
  getPrediction: (id, callback) => {
    Prediction.find({ _id: id }, callback);
  },
  updatePrediction: (id, body, callback) => {
    Prediction.findByIdAndUpdate(id, body, callback);
  },
  deletePrediction: (id, callback) => {
    Prediction.deleteOne({ _id: id }, callback);
  },
  getPredictionByIdMatch: (match_id, callback) => {
    Prediction.find({ match_id: match_id }, callback);
  }
}
