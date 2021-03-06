const Score = require('../models/score.model');
const getTopTeams = require('../utilities/getTopTeams');
// const calcScore = require('../utilities/calcScore');
const sortKindOfMatches = require('../utilities/sortKindOfMatches');
const sortByGroup = require('../utilities/sortByGroup');

module.exports = function (scores, groupName) {
  let { scoresOfAllTables, scoresOfAllQuaterFinal, scoresOfAllSemiFinal, scoresOfAllFinal, scoresOfAllFinal32 } = sortKindOfMatches(scores);

  // Nếu các trận bán kết hay tứ kết (với 32 đội) đã được set thì mới bắt đầu set chung kết hay bán kết (với 32 đội)
  let _unSetSemiFinal = scoresOfAllSemiFinal.filter(score => (score.score === null));
  let _unSetFinal = scoresOfAllFinal.filter(score => (score.score === null));
  // Nếu các trận tứ kết hay knockout (với 32 đội) đã được set thì bắt đầu set bán kết hay tứ kết (với 32 đội)
  let unSetQuarterFinal = scoresOfAllQuaterFinal.filter(score => (score.score === null));
  if (!unSetQuarterFinal.length && _unSetSemiFinal.length) {
    // if (1) {
    let indexsRunning = [0, 1, 2, 3, 4, 5, 6, 7];
    let indexRun = 0;

    let scoresByQuaterFinal = sortByGroup(scoresOfAllQuaterFinal, false);
    scoresByQuaterFinal.map((_scoresEachGroup) => {
      let teamsInformation = getTopTeams(_scoresEachGroup, 1);
      // sort by home and round
      // because fix bug position, change score.!!!
      scoresOfAllSemiFinal.sort(
        (a, b) => {
          return (a.match_id.round - b.match_id.round) || (b.home - a.home)
        }
      )
      teamsInformation.map(teamInformation => {
        let indexsRunnings = indexsRunning[indexRun++];
        // To save by home
        scoresOfAllSemiFinal[indexsRunnings].home = !(indexsRunnings % 2);
        //-------------------c

        let score = new Score(scoresOfAllSemiFinal[indexsRunnings]);
        score.tournament_team_id = teamInformation.tournamentTeamId;
        score.save(err => { if (err) throw err });
      })
    });
    console.log(1);
    return true;
  } else if (!_unSetSemiFinal.length && _unSetFinal.length) {
    // } else if (1) {
    let scoresBySemiFinal = sortByGroup(scoresOfAllSemiFinal);
    // sort by home and round
    // because fix bug position, change score.!!!
    scoresOfAllFinal.sort(
      (a, b) => {
        return (a.match_id.round - b.match_id.round) || (b.home - a.home)
      }
    )
    scoresBySemiFinal.map(async (_scoresEachGroup, index) => {
      // Save score by home
      // Set home return true false as position: left right
      scoresOfAllFinal[index].home = !(index % 2);
      //-------------------chau

      let teamInformation = getTopTeams(_scoresEachGroup, 2)[0];
      let score = new Score(scoresOfAllFinal[index]);
      score.tournament_team_id = teamInformation.tournamentTeamId;
      await score.save(err => { if (err) throw err });
    })
    console.log(2);
    return true;
  } else
    // Nếu các trận bán kết (với 32 đội) đã được set thì bắt đầu set chung kết.
    if (!_unSetFinal.length) {
      // if (1) {
      // sort by home and round
      // because fix bug position, change score.
      scoresOfAllFinal32.sort(
        (a, b) => {
          return (a.match_id.round - b.match_id.round) || (b.home - a.home)
        }
      )
      let scoresByFinal = sortByGroup(scoresOfAllFinal);
      scoresByFinal.map((_scoresEachGroup, index) => {
        // Save score by home
        scoresOfAllFinal32[index].home = !(index % 2);
        //-------------------chau
        let teamInformation = getTopTeams(_scoresEachGroup, 2)[0];
        let score = new Score(scoresOfAllFinal32[index]);
        score.tournament_team_id = teamInformation.tournamentTeamId;
        score.save(err => { if (err) throw err });
      })
      console.log(3);
      return true;
    }

  // Nếu các trận vòng bảng đã được set thì bắt đầu set tứ kết hay knockout (với 32 đội)
  // let unSetAllKnockOut = scores.filter(score => (score.score === null && score.match_id.round === 1));
  // if (!unSetAllKnockOut.length) {
  //   let indexsRunning = [0, 3, 2, 1, 4, 7, 5, 6, 8, 11, 10, 9, 12, 15, 13, 14];
  //   let indexRun = 0;
  //   let scoresByGroupName = sortByGroup(scoresOfAllTables, false);
  //   scoresByGroupName.map((_scoresEachGroup) => {
  //     let teamsInformationOfTwelve = calcScore(_scoresEachGroup);
  //     let teamsInformation = getTopTeams(teamsInformationOfTwelve, 0);
  //     teamsInformation.map(teamInformation => {
  //       let indexsRunnings = indexsRunning[indexRun++];
  //       let score = new Score(scoresOfAllQuaterFinal[indexsRunnings]);
  //       score.tournament_team_id = teamInformation.tournamentTeamId;
  //       score.save(err => { if (err) throw err });
  //     })
  //   });
  // }
}

