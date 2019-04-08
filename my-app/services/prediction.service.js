const Prediction = require('./../models/prediction.model');
const Match = require('../models/match.model');
const Score = require('../models/score.model');

module.exports = {
  selectAll: (callback) => {
    Prediction.find(callback);
  },
  selectForAdmin: (callback) => {
    Prediction.find({}).populate({ path: 'match_id tournament_team_id', populate: { path: 'tournamentId team_id' } })
    .then(predictions => {
      if (predictions == ![]) predictions = null;
      if (predictions) {
        let result = [];
        let predictionsLengh = predictions.length;

        for (let i = 0; i < predictionsLengh; i++) {
          for (let j = i + 1; j < predictionsLengh; j++) {
            if (predictions[i].match_id._id === predictions[j].match_id._id) {
              Score.find({ match_id: predictions[i].match_id._id }, (err, score) => {
                if (err) throw err;
                result.push({
                  match_id: predictions[i].match_id,
                  round: predictions[i].match_id.round,
                  group: predictions[i].tournament_team_id ? predictions[i].tournament_team_id.groupName : null,
                  start_at: predictions[i].match_id.start_at,
                  firstTeam: {
                    firstTournamentTeamId: predictions[i].tournament_team_id ? predictions[i].tournament_team_id._id : null,
                    firstTeamId: predictions[i].tournament_team_id ? predictions[i].tournament_team_id.team_id._id : '',
                    code: predictions[i].tournament_team_id ? predictions[i].tournament_team_id.team_id.code : null,
                    logo: predictions[i].tournament_team_id ? `../../../assets/images/${predictions[i].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
                    score: predictions[i].score_prediction,
                    score_prediction: score[i] ? score[i].score : null
                  },
                  secondTeam: {
                    secondTournamentTeamId: predictions[j].tournament_team_id ? predictions[j].tournament_team_id._id : null,
                    secondTeamId: predictions[j].tournament_team_id ? predictions[j].tournament_team_id.team_id._id : '',
                    code: predictions[j].tournament_team_id ? predictions[j].tournament_team_id.team_id.code : null,
                    logo: predictions[j].tournament_team_id ? `../../../assets/images/${predictions[j].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
                    score: predictions[j].score_prediction,
                  },
                  prediction: {
                    is_predicted: predictions.length ? true : false,
                    user_id: predictions.length ? predictions[i].user_id : null,
                    firstTeam_score_prediction: predictions.length ? predictions[i].score_prediction : '',
                    secondTeam_score_prediction: predictions.length ? predictions[j].score_prediction : '',
                    date: predictions.length ? predictions[j].date : null
                  }
                });
                if (result.length === predictionsLengh / 2) {
                  callback(null, result);
                }
              })
            }
          }
        }
      } else {
        callback(null, null);
      }
    });
  },
  createPrediction: (body, callback) => {
    Match.findOne({ _id: body.match_id }, (err, match) => {
      if (err) throw err;
      let matchTime = new Date(match.start_at).getTime();
      if (matchTime > new Date().getTime()) {
        Prediction.find({ match_id: body.match_id, user_id: body.user_id }, (err, predictions) => {
          if (err) throw err;
          if (predictions.length) {
            predictions.map((prediction, i) => {
              prediction.score_prediction = body.scorePrediction[i],
              prediction.date = Date.now(),
              prediction.tournament_team_id = body.tournament_team_id[i];
              prediction.save((error) => {
                if (error) throw error;
              })
            });
          } else {
            for (let i = 0, p = Promise.resolve(); i < 2; i++) {
              p = p.then(_ => new Promise(resolve => {
                new Prediction({
                  match_id: body.match_id,
                  date: Date.now(),
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
  getAllPrediction: (id, callback) => {
    Prediction.find({ user_id: id }).populate({ path: 'match_id tournament_team_id', populate: { path: 'tournamentId team_id' } })
      .then(predictions => {
        if (predictions == ![]) predictions = null;
        if (predictions) {
          let result = [];
          let predictionsLengh = predictions.length;
  
          for (let i = 0; i < predictionsLengh; i++) {
            for (let j = i + 1; j < predictionsLengh; j++) {
              if (predictions[i].match_id._id === predictions[j].match_id._id) {
                Score.find({ match_id: predictions[i].match_id._id }, (err, score) => {
                  if (err) throw err;
                  result.push({
                    match_id: predictions[i].match_id,
                    round: predictions[i].match_id.round,
                    group: predictions[i].tournament_team_id ? predictions[i].tournament_team_id.groupName : null,
                    start_at: predictions[i].match_id.start_at,
                    firstTeam: {
                      firstTournamentTeamId: predictions[i].tournament_team_id ? predictions[i].tournament_team_id._id : null,
                      firstTeamId: predictions[i].tournament_team_id ? predictions[i].tournament_team_id.team_id._id : '',
                      code: predictions[i].tournament_team_id ? predictions[i].tournament_team_id.team_id.code : null,
                      logo: predictions[i].tournament_team_id ? `../../../assets/images/${predictions[i].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
                      score: predictions[i].score_prediction,
                      score_prediction: score[i] ? score[i].score : null
                    },
                    secondTeam: {
                      secondTournamentTeamId: predictions[j].tournament_team_id ? predictions[j].tournament_team_id._id : null,
                      secondTeamId: predictions[j].tournament_team_id ? predictions[j].tournament_team_id.team_id._id : '',
                      code: predictions[j].tournament_team_id ? predictions[j].tournament_team_id.team_id.code : null,
                      logo: predictions[j].tournament_team_id ? `../../../assets/images/${predictions[j].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
                      score: predictions[j].score_prediction,
                    },
                    prediction: {
											is_predicted: predictions.length ? true : false,
											user_id: predictions.length ? predictions[i].user_id : null,
											firstTeam_score_prediction: predictions.length ? predictions[i].score_prediction : '',
                      secondTeam_score_prediction: predictions.length ? predictions[j].score_prediction : '',
                      date: predictions.length ? predictions[j].date : null
										}
                  });
                  if (result.length === predictionsLengh / 2) {
                    callback(null, result);
                  }
                })
              }
            }
          }
        } else {
          callback(null, null);
        }
      });
  },
  getTopPredictionUser: async (id, callback) => {
    let scores = await Score.find({ match_id: id, score: { $ne: null } });
    if (scores.length) {
      let predictions = await Prediction.find({ match_id: id }).populate({ path: 'user_id' });
      if (predictions.length) {
        let firstScore = scores[0].score;
        let secondScore = scores[1].score;
        let topUsers = [];
        for (let i = 0; i < predictions.length; i+= 2) {
          if (
            predictions[i].score_prediction === firstScore && 
            predictions[i + 1].score_prediction === secondScore
          ) {
            topUsers.push({date: predictions[i].date, user: predictions[i].user_id});
          }
          // if (topUsers.length === 3) return;
        }
        return callback(null, topUsers);
      }
    }
    callback(null, null);
  },
  updatePrediction: (id, body, callback) => {
    Prediction.findByIdAndUpdate(id, body, callback);
  },
  deletePrediction: (id, callback) => {
    Prediction.deleteOne({ _id: id }, callback);
  },
  deletePredictionByUser: (id, callback) => {
    Prediction.deleteMany({ user_id: id }, callback);
  },
  getPredictionByIdMatch: (match_id, callback) => {
    Prediction.find({ match_id: match_id }, callback);
  }
}
