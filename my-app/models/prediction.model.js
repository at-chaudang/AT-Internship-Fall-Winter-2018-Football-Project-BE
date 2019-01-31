const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema({
  match_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Match'
  },
  date: {
    type: Date,
    required: false
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  score_prediction: {
    type: String,
    required: false
  },
  tournament_team_id: {
    type: String,
    require: false
  }
}, {strict: false});

module.exports = mongoose.model('Prediction', predictionSchema);
