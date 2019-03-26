const Match = require('../models/match.model');
const Score = require('../models/score.model');
const Prediction = require('../models/prediction.model');
const TournamentTeam = require('../models/tournament_team.model');
const utilities = require('../utilities/index');
const Operator = require('../models/tournament_team.model');
const oneYear = 3600 * 24 * 365 * 1000;

module.exports = {
  setKnockout: async (body, callback) => {
    await body.map(
      x => {
        TournamentTeam.findById(
          x.tournamentTeamId._id, (err, y) => {
            if (err) throw err;
            if (y.position) {
              y.position = x.position
              y.save(err => {
                if (err) throw err;
              });
            } else {
              y.update(
                {
                  position: x.position
                },
                err => {
                  if (err) throw err;
                });
            }
          }
        )
      })
      callback(null, null);
  },
}
