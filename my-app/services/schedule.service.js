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

              scores[index].tournament_team_id = x.tournamentTeamId._id;
              scores[index].save(err => { if (err) throw err; });
              if (index) {
                callback(null, 200);
              }
            });
          });
        }
      });
  },
};

function setKnockoutSupport() {
  Match.find({ tournamentId: tournamentId })
    .then(
      matches => {
        let matchesIds = matches.map(match => match._id);
        return Score.find({ match_id: { $in: matchesIds } })
          .populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } });
      })
    .then(
      scores => {
          let { scoresOfAllTables } = utilities.sortKindOfMatches(scores);
          let scoresByGroupName = utilities.sortByGroup(scoresOfAllTables, false);
          let responsingData = [];
          scoresByGroupName.map((_scoresEachGroup) => {
            let teamsInformationOfTwelve = utilities.calcScore(_scoresEachGroup);
            utilities.getTopTeams(teamsInformationOfTwelve, 0, 4).map(teamsInformation => {
              responsingData.push(teamsInformation);
            });
          })
          callback(null, responsingData);
        }
    );
};
