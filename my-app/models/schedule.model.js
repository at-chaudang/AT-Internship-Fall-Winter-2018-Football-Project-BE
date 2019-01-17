const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  group: {
    type: String
  },
  firstTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  secondTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  matchDate: {
    type: Date
  }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
