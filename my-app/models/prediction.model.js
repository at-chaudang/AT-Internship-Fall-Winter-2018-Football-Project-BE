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
  scorePrediction: [{
    type: Number,
    required: false
  }],
  tournament_team_id: [],
});

module.exports = mongoose.model('Prediction', predictionSchema);
