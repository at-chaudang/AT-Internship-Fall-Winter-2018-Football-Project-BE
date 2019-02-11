const mongoose = require('mongoose');

const tournamentSchema = mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  start_at: {
    type: Date,
    required: false
  },
  end_at: {
    type: Date,
    required: false
  },
  group_number: {
    type: Number,
    required: false
  },
  des: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
