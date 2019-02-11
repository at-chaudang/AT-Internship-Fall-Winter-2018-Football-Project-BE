const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
  play_at: {
    type: String,
    required: false
  },
  knockout: {
    type: String,
    required: false
  },
  winner: {
    type: String,
    required: false
  },
  score_id: {
    type: Schema.Types.ObjectId,
    ref: 'Score'
  },
  tournament_id: {
    type: Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  prediction_id: {
    type: Schema.Types.ObjectId,
    ref: 'Prediction'
  },
  start_at: {
    type: Date,
    required: false
  }
}, {strict: false});

module.exports = mongoose.model('Match', matchSchema);
