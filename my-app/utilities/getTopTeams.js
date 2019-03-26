module.exports = function (teamsInformationOfTwelve, flag, splice = 2) {
  let teamsInformation = [];

  if (!flag) {
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
    }).splice(splice);
    teamsInformation.map(
      (x, i) => {
        x.position = i%4 + 1;
      }
    )
  } else {
    for (let i = 0; i < 2; i++) {
      teamsInformation.push({
        // _scoresEachGroup[i] = teamsInformationOfTwelve
        tournamentTeamId: teamsInformationOfTwelve[i].tournament_team_id ? teamsInformationOfTwelve[i].tournament_team_id._id : null,
        score: +teamsInformationOfTwelve[i].score,
        winner: +teamsInformationOfTwelve[i].winner,
      });
    }
    teamsInformation.sort((a, b) => {
      return b.winner - a.winner;
    }).splice(1);
  }

  return teamsInformation;
}
