module.exports = function(scores) {
  let scoresBySorted = {
    scoresOfAllTables: [],
    scoresOfAllQuaterFinal: [],
    scoresOfAllSemiFinal: [],
    scoresOfAllFinal: [],
    scoresOfAllFinal32: []
  }

  scores.map(score => {
    if (score.match_id.round < 2) {
      scoresBySorted.scoresOfAllTables.push(score)
    } else if (score.match_id.round < 3) {
      scoresBySorted.scoresOfAllQuaterFinal.push(score);
    } else if (score.match_id.round < 4) {
      scoresBySorted.scoresOfAllSemiFinal.push(score)
    } else if (score.match_id.round < 5) {
      scoresBySorted.scoresOfAllFinal.push(score)
    } else {
      scoresBySorted.scoresOfAllFinal32.push(score);
    }
  })

  scoresBySorted.scoresOfAllTables.sort((a, b) => {
    return a.tournament_team_id.groupName > b.tournament_team_id.groupName ? 1 : -1;
  });

  scoresBySorted.scoresOfAllQuaterFinal.sort((a, b) => {
    return a.match_id.round > b.match_id.round ? 1 : -1;
  });

  scoresBySorted.scoresOfAllSemiFinal.sort((a, b) => {
    return a.match_id.round > b.match_id.round ? 1 : -1;
  });

  scoresBySorted.scoresOfAllFinal.sort((a, b) => {
    return a.match_id.round > b.match_id.round ? 1 : -1;
  });

  scoresBySorted.scoresOfAllFinal32.sort((a, b) => {
    return a.match_id.round > b.match_id.round ? 1 : -1;
  });

  return scoresBySorted;
}
