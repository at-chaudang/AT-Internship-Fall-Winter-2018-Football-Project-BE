const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
  play_at: {
    type: String,
    required: false
  },
  round: {
    type: Number,
    required: false
  },
  tournamentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tournament'
  },
  desc: {
    type: String
  },
  start_at: {
    type: Date,
    required: false
  }
}, { strict: false });

module.exports = mongoose.model('Match', matchSchema);
