module.exports = function(_scoresEachGroup) {
  let teamsInformationOfTwelve = [];
  let _scoresEachGroupLength = _scoresEachGroup.length;

  /* Đầu tiên là sort theo trận. */
  _scoresEachGroup.sort((a, b) => {
    return a.match_id > b.match_id ? 1 : -1;
  });

  for (let i = 0; i < _scoresEachGroupLength; i += 2) {
    let firstTeamPoints = 0;
    let secondTeamPoints = 0;

    let scoresEachGroupFirstScore = _scoresEachGroup[i].score;
    let scoresEachGroupFirstTourTeamId = _scoresEachGroup[i].tournament_team_id;
    let scoresEachGroupFirstWinner = _scoresEachGroup[i].winner;
    
    let scoresEachGroupNextScore = _scoresEachGroup[i + 1].score;
    let scoresEachGroupNextTourTeamId = _scoresEachGroup[i + 1].tournament_team_id;
    let scoresEachGroupNextWinner = _scoresEachGroup[i + 1].winner;

    if (scoresEachGroupFirstScore > scoresEachGroupNextScore) {
      firstTeamPoints = 3;
      secondTeamPoints = 0
    } else {
      if (scoresEachGroupFirstScore < scoresEachGroupNextScore) {
        firstTeamPoints = 0;
        secondTeamPoints = 3;
      } else {
        if (scoresEachGroupFirstScore && scoresEachGroupNextScore) {
          firstTeamPoints = secondTeamPoints = 1;
        }
      }
    }

    teamsInformationOfTwelve.push({
      tournamentTeamId: scoresEachGroupFirstTourTeamId,
      points: firstTeamPoints,
      goals: scoresEachGroupFirstScore,
      winner: scoresEachGroupFirstWinner
    }, {
        tournamentTeamId: scoresEachGroupNextTourTeamId,
        points: secondTeamPoints,
        goals: scoresEachGroupNextScore,
        winner: scoresEachGroupNextWinner
      })
  }
  // Tiếp theo là sort theo teamId
  teamsInformationOfTwelve.sort((a, b) => a.tournamentTeamId._id > b.tournamentTeamId._id ? 1 : -1);

  return teamsInformationOfTwelve;
}
