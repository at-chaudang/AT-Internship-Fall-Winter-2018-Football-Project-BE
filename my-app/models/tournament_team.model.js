const mongoose = require('mongoose');

const tournamentTeamSchema = mongoose.Schema({
  tournament_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tournament'
  },
  team_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  },
  groupName: {
    type: String
  },
  position: {
    type: String
  },
  isKnockoutSet: {
    type: Boolean
  }
});

module.exports = mongoose.model('Operator', tournamentTeamSchema);
