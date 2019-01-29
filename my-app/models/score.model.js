const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema({
  match_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Match'
  },
  tournament_team_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Operator'
  },
  home: {
    type: Boolean,
    required: false
  },
  winner: {
    type: Boolean
  },
  score: {
    type: String,
    required: false
  }
}, { strict: false });

module.exports = mongoose.model('Score', scoreSchema);
