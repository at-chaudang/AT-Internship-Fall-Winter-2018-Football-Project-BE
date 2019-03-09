const Score = require('../models/score.model');
const getTopTeams = require('../utilities/getTopTeams');
const calcScore = require('../utilities/calcScore');
const sortKindOfMatches = require('../utilities/sortKindOfMatches');
const sortByGroup = require('../utilities/sortByGroup');

module.exports = function (scores) {
  let unSetAllKnockOut = scores.filter(score => (score.score === null && score.match_id.round === 1));
  let indexsRunning = [0, 3, 2, 1, 4, 7, 5, 6, 8, 11, 10, 9, 12, 15, 13, 14];
  let indexRun = 0;

  if (!unSetAllKnockOut.length) {
    let { scoresOfAllTables, scoresOfAllQuaterFinal, scoresOfAllSemiFinal, scoresOfAllFinal } = sortKindOfMatches(scores);

    let scoresByGroupName = sortByGroup(scoresOfAllTables, false);
    scoresByGroupName.map((_scoresEachGroup) => {
      let teamsInformation = [];
      let teamsInformationOfTwelve = calcScore(_scoresEachGroup);
      teamsInformation = getTopTeams(teamsInformationOfTwelve, 0);

      teamsInformation.map(teamInformation => {
        let indexsRunnings = indexsRunning[indexRun++];
        let score = new Score(scoresOfAllQuaterFinal[indexsRunnings]);
        score.tournament_team_id = teamInformation.tournamentTeamId;
        score.save(err => { if (err) throw err });
      })
    })

    let unSetQuarterFinal = scoresOfAllQuaterFinal.filter(score => (score.score === null));
    if (!unSetQuarterFinal.length) {
      let scoresByQuaterFinal = sortByGroup(scoresOfAllQuaterFinal, false);
      let indexsRunning = [0, 1, 2, 3, 4, 5, 6, 7];
      let indexRun = 0;
      scoresByQuaterFinal.map((_scoresEachGroup) => {
        let teamsInformation = getTopTeams(_scoresEachGroup, 1);
        teamsInformation.map(teamInformation => {
          let indexsRunnings = indexsRunning[indexRun++];
          let score = new Score(scoresOfAllSemiFinal[indexsRunnings]);
          score.tournament_team_id = teamInformation.tournamentTeamId;
          score.save(err => { if (err) throw err });
        })
      });

      let unSetSemiFinal = scoresOfAllSemiFinal.filter(score => (score.score === null));
      if (!unSetSemiFinal.length) {
        let scoresBySemiFinal = sortByGroup(scoresOfAllSemiFinal);
        scoresBySemiFinal.map((_scoresEachGroup, index) => {
          let teamsInformation = getTopTeams(_scoresEachGroup, 2);
          teamsInformation.map((teamInformation) => {
            let score = new Score(scoresOfAllFinal[index]);
            score.tournament_team_id = teamInformation.tournamentTeamId;
            score.save(err => { if (err) throw err });
          })
        })
      }
    }
  }
}

/* function saveToDB(teamsInformation, scoresOfAllKnockout, indexRun) {
  let indexRuns = indexRun;
  let indexsRunning = [0, 3, 2, 1, 4, 7, 6, 5, 0, 3, 2, 1, 0, 1];

  teamsInformation.map(teamInformation => {
    let score = new Score(scoresOfAllKnockout[indexsRunning[indexRuns++]]);
    score.tournament_team_id = teamInformation.tournamentTeamId;
    score.save(err => {if (err) throw err});
  })
} */
