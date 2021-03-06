const TournamentTeam = require('../models/tournament_team.model');
const Match = require('../models/match.model');
const Score = require('../models/score.model');
const information = [
  {
    groupName: 'A',
    position: [2.1, 2.2],
  },
  {
    groupName: 'B',
    position: [2.2, 2.1],
  },
  {
    groupName: 'C',
    position: [2.3, 2.4],
  },
  {
    groupName: 'D',
    position: [2.4, 2.3],
  },
  {
    groupName: 'E',
    position: [2.5, 2.6],
  },
  {
    groupName: 'F',
    position: [2.6, 2.5],
  },
  {
    groupName: 'G',
    position: [2.7, 2.8],
  },
  {
    groupName: 'H',
    position: [2.8, 2.7],
  }
]

module.exports = {
  setKnockout: async (body, callback) => {
    await body.map(
      // x is team object, y is operator.
      (x, index) => {
        TournamentTeam.findById(
          x.tournamentTeamId._id, (err, y) => {
            if (err) throw err;
            // let conditions = {_id: y._id};
            // let update = "{ $set: { name: 'jason bourne' }}";
            // TournamentTeam.update(conditions, update, options, callback);
            if (y.position) {
              y.position = x.position;
              y.isKnockoutSet = x.isKnockoutSet;
              y.save(err => {
                if (err) throw err;
              });
            } else {
              y.update(
                {
                  position: x.position,
                  isKnockoutSet: x.isKnockoutSet
                },
                err => {
                  if (err) throw err;
                });
            };
          }
        );
        if (index < 2) {
          let infor = information.find(inf => inf.groupName === x.tournamentTeamId.groupName);

          Match.findOne({ tournamentId: x.tournamentTeamId.tournament_id, round: infor.position[index] }, (err, match) => {
            if (err) throw err;
            Score.find({ match_id: match.id }, (err, scores) => {
              if (err) throw err;
              // Check position left right of team in match
              scores.map((score, i) => {
                if (score.home == !index) {
                score.tournament_team_id = x.tournamentTeamId._id;                  
                score.save(err => { if (err) throw err; });
                }
              })
              if (index) {
                callback(null, 200);
              }
            });
          });
        }
      });
  },
};
