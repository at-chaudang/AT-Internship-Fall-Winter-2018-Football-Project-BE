const Prediction = require('./../models/prediction.model');
const Match = require('../models/match.model');

module.exports = {
  selectAll: (callback) => {
    Prediction.find(callback);
  },
  createPrediction: (body, callback) => {
    Match.findOne({ _id: body.match_id }, (err, match) => {
      if (err) throw err;
      let matchTime = new Date(match.start_at).getTime();
      if (matchTime > new Date().getTime()) {
        Prediction.find({ match_id: body.match_id }, (err, predictions) => {
          if (err) throw err;
          if (predictions.length) {
            predictions.map((prediction, i) => {
              prediction.score_prediction = body.scorePrediction[i],
              prediction.tournament_team_id = body.tournament_team_id[i]
              prediction.save((error) => {
                if (error) throw error;
              })
            });
          } else {
            for (let i = 0, p = Promise.resolve(); i < 2; i++) {
              p = p.then(_ => new Promise(resolve => {
                new Prediction({
                  match_id: body.match_id,
                  date: body.date,
                  user_id: body.user_id,
                  score_prediction: body.scorePrediction[i],
                  tournament_team_id: body.tournament_team_id[i]
                }).save((error) => {
                  if (error) throw error;
                  resolve();
                });
              }))
            }
          }
          callback(null, 200);
        })
      } else {
        callback(null, 302);
      }
    })
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
