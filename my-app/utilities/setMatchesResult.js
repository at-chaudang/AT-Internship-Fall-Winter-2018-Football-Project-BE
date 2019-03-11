const Score = require('../models/score.model');
const getTopTeams = require('../utilities/getTopTeams');
const calcScore = require('../utilities/calcScore');
const sortKindOfMatches = require('../utilities/sortKindOfMatches');
const sortByGroup = require('../utilities/sortByGroup');

module.exports = function (scores) {
  let { scoresOfAllTables, scoresOfAllQuaterFinal, scoresOfAllSemiFinal, scoresOfAllFinal, scoresOfAllFinal32 } = sortKindOfMatches(scores);

  // Nếu các trận vòng bảng đã được set thì bắt đầu set tứ kết hay knockout (với 32 đội)
  let unSetAllKnockOut = scores.filter(score => (score.score === null && score.match_id.round === 1));
  if (!unSetAllKnockOut.length) {
    let scoresByGroupName = sortByGroup(scoresOfAllTables, false);
    let indexsRunning = [0, 3, 2, 1, 4, 7, 5, 6, 8, 11, 10, 9, 12, 15, 13, 14];
    let indexRun = 0;
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
    });
  }

  let unSetQuarterFinal = scoresOfAllQuaterFinal.findIndex(score => (score.score === null));
  // Nếu các trận tứ kết hay knockout (với 32 đội) đã được set thì bắt đầu set bán kết hay tứ kết (với 32 đội)
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
  }

  // Nếu các trận bán kết hay tứ kết (với 32 đội) đã được set thì mới bắt đầu set chung kết hay bán kết (với 32 đội)
  let _unSetSemiFinal = scoresOfAllSemiFinal.filter(score => (score.score === null));
  let _unSetFinal = scoresOfAllFinal.filter(score => (score.score === null));
  if (!_unSetSemiFinal.length) {
    let scoresBySemiFinal = sortByGroup(scoresOfAllSemiFinal);
    scoresBySemiFinal.map((_scoresEachGroup, index) => {
      let teamInformation = getTopTeams(_scoresEachGroup, 2)[0];
      let score = new Score(scoresOfAllFinal[index]);
      score.tournament_team_id = teamInformation.tournamentTeamId;
      score.save(err => { if (err) throw err });
    })
  }

  // Nếu các trận bán kết (với 32 đội) đã được set thì bắt đầu set chung kết.
  if (!_unSetFinal.length) {
    let scoresByFinal = sortByGroup(scoresOfAllFinal);
    scoresByFinal.map((_scoresEachGroup, index) => {
      let teamInformation = getTopTeams(_scoresEachGroup, 2)[0];
      let score = new Score(scoresOfAllFinal32[index]);
      score.tournament_team_id = teamInformation.tournamentTeamId;
      score.save(err => { if (err) throw err });
    })
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
