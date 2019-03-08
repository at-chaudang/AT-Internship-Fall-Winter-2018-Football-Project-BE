const Score = require('../models/score.model');

module.exports = function (data, scoresOfAllQuaterFinal, scoresOfAllSemiFinal, scoresOfAllFinal) {
  let indexsRunning = [0, 3, 2, 1, 4, 7, 6, 5, 0, 3, 2, 1, 0, 1];
  let indexRun = 0;
  data.map((scoresByGroups, scoresByGroupsKey) => {
    // Loop through each tables
    scoresByGroups.map((_scoresEachGroup, _indexScoresEachGroup) => {
      // Find out whether each table's match is set or not.
      let unSetKnockOut = _scoresEachGroup.filter(score => {
        return score.score === null
      })

      if (!unSetKnockOut.length) {
        // Đầu tiên là sort theo trận.
        _scoresEachGroup.sort((a, b) => {
          return a.match_id > b.match_id ? 1 : -1;
        });

        let teamsInformation = [];

        if (!scoresByGroupsKey) {
          let teamsInformationOfTwelve = [];
          for (let i = 0; i < _scoresEachGroup.length; i += 2) {
            let firstTeamPoints = 0;
            let secondTeamPoints = 0;
            if (_scoresEachGroup[i].score > _scoresEachGroup[i + 1].score) {
              firstTeamPoints = 3;
              secondTeamPoints = 0
            } else {
              if (_scoresEachGroup[i].score < _scoresEachGroup[i + 1].score) {
                firstTeamPoints = 0;
                secondTeamPoints = 3;
              } else {
                firstTeamPoints = secondTeamPoints = 1;
              }
            }
            teamsInformationOfTwelve.push({
              tournamentTeamId: _scoresEachGroup[i].tournament_team_id,
              points: firstTeamPoints,
              goals: _scoresEachGroup[i].score,
              winner: _scoresEachGroup[i].winner
            }, {
                tournamentTeamId: _scoresEachGroup[i + 1].tournament_team_id,
                points: secondTeamPoints,
                goals: _scoresEachGroup[i + 1].score,
                winner: _scoresEachGroup[i + 1].winner
              })
          }
          // Tiếp theo là sort theo teamId
          teamsInformationOfTwelve.sort((a, b) => a.tournamentTeamId._id > b.tournamentTeamId._id ? 1 : -1)
        // Separate scores into 4 groups by each team to get scores and winners.
          for (let i = 0; i < 4; i++) {
            let totalGoals = winners = points = 0;
            // Sort 12 scores by each team, each 3 scores for 1 team.
            for (let j = i * 3; j < i * 3 + 3; j++) {
              totalGoals += +teamsInformationOfTwelve[j].goals;
              winners += +teamsInformationOfTwelve[j].winner;
              points += teamsInformationOfTwelve[j].points
            }
            teamsInformation.push({
              tournamentTeamId: teamsInformationOfTwelve[i * 3].tournamentTeamId,
              winner: winners,
              points: points,
              goals: totalGoals
            });
          }
          // Get information of 2 teams that have highest winner number and score nummber.
          teamsInformation.sort((a, b) => {
            return (b.points - a.points) || (b.winner - a.winner) || (b.score - a.score);
          }).splice(2);
          
          teamsInformation.map((teamInformation) => {
            let score__ = new Score(scoresOfAllQuaterFinal[indexsRunning[indexRun++]]);
            score__.tournament_team_id = teamInformation.tournamentTeamId;
            score__.save(err => {if (err) throw err});
          })
        } else {
          let indexRound = (scoresByGroupsKey === 1) ? 2 : 1;
            for (let i = 0; i < indexRound; i++) {
              teamsInformation.push({
                tournamentTeamId: _scoresEachGroup[i].tournament_team_id._id,
                score: +_scoresEachGroup[i].score,
                winner: +_scoresEachGroup[i].winner,
              });
            }
            teamsInformation.sort((a, b) => {
              return ((a.score - b.score) || (a.winner - b.winner)) ? -1 : 1;
            }).splice(1);
            if (scoresByGroupsKey === 1) {
              teamsInformation.map((teamInformation) => {
                let score__ = new Score(scoresOfAllSemiFinal[indexsRunning[indexRun++]]);
                score__["tournament_team_id"] = teamInformation.tournamentTeamId;
                score__.save(err => {if (err) throw err});
              })
            } else {
              teamsInformation.map((teamInformation) => {
                let score__ = new Score(scoresOfAllFinal[indexsRunning[indexRun++]]);
                score__["tournament_team_id"] = teamInformation.tournamentTeamId;
                score__.save(err => {if (err) throw err});
              })
            }
        }
      }
    });
  });
}
