const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  tournament_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tournament'
  },
  group_id: {
    type: String
  },
  first_team_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  },
  second_team_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
