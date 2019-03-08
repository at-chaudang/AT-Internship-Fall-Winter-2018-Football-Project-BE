const Score = require('../models/score.model');

module.exports = function (data) {
  let indexsRunning = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0];
  let indexRun = 0;

  data.map((scoresByGroups, scoresByGroupsKey) => {
    // Loop through each tables
    scoresByGroups.map((_scoresEachGroup, _indexScoresEachGroup) => {
      // Find out whether each table's match is set or not.
      let unSetKnockOut = _scoresEachGroup.filter(score => {
        return score.score === null
      })
      if (!unSetKnockOut.length) {
        let teamsInformation = [];
        _scoresEachGroup.map(b => {
          console.log(b);
        });
        // Sort 12 scores by each team, each 3 scores for 1 team.
        // _scoresEachGroup.sort((a, b) => {
        //   return a.tournament_team_id > b.tournament_team_id ? 1 : -1;
        // });
        // Separate scores into 4 groups by each team to get scores and winners.
        // if (!scoresByGroupsKey) {
        //   for (let i = 0; i < 4; i++) {
        //     let totalGoals = winner = 0;
        //     for (let j = i * 3; j < i * 3 + 3; j++) {
        //       totalGoals += +_scoresEachGroup[j].score;
        //       winner += +_scoresEachGroup[j].winner;
        //     }
        //     teamsInformation.push({
        //       team: _scoresEachGroup[i * 3],
        //       score: totalGoals,
        //       winner: winner
        //     });
        //   }

        //   // Get information of 2 teams that have highest winner number and score nummber.
        //   teamsInformation.sort((a, b) => {
        //     return (b.winner - a.winner) || (b.score - a.score);
        //   }).splice(2);
        // } else {
        //   let indexRound = (scoresByGroupsKey !== 1) ? 2 : 1;
        //   for (let i = 0; i < indexRound; i++) {
        //     teamsInformation.push({
        //       team: _scoresEachGroup[i],
        //       score: +_scoresEachGroup[i].score,
        //       winner: +_scoresEachGroup[i].winner,
        //     });
        //   }
        //   teamsInformation.sort((a, b) => {
        //     return (b.winner - a.winner) || (b.score - a.score);
        //   }).splice(1);
        // }

        // let indexSuffixScore = _indexScoresEachGroup + 1;
        // if (!!scoresByGroupsKey && indexSuffixScore > 2) indexSuffixScore -= 2;
        // if (!!scoresByGroupsKey && indexSuffixScore > 2) { 
        //   indexSuffixScore -= 2 
        // }
        // // Loop to set to inner rounds.
        // for (let i = 0, p = Promise.resolve(); i < teamsInformation.length; i++) {
        //   p = p.then(_ => new Promise(resolve => {
        //     let match_id = teamsInformation[i].team.match_id._id;
        //     if (!teamsInformation[i].score) {
        //       Score.find({ match_id: match_id }, (err, scores) => {
        //         if (err) throw err;
        //         scores[indexsRunning[indexRun]].tournament_team_id = teamsInformation[i].team.tournament_team_id._id;
        //         scores[indexsRunning[indexRun]].home = !indexSuffixScore;
        //         scores[indexsRunning[indexRun++]].save((error) => {
        //           if (error) throw error;
        //           indexSuffixScore++;
        //         });
        //         if (indexSuffixScore === 3 || indexSuffixScore === 5) {
        //           indexSuffixScore -= 2;
        //         };
        //       });
        //       resolve();
        //     }
        //   }))
        // }
      }
    });
  });
}
