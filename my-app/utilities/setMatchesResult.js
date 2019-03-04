const Score = require('../models/score.model');

module.exports = function (result, data) {
  data.map((scoresByGroups, scoresByGroupsKey) => {
    // Lặp từng mỗi nhóm bảng.
    scoresByGroups.map((_scoresEachGroup, _indexScoresEachGroup) => {
      // Tìm xem trong mỗi bảng có trận mô chưa set ko.
      let unSetKnockOut = _scoresEachGroup.filter(score => {
        return score.score === null
      })
      if (!unSetKnockOut.length) {
        let teamsInformation = [];
  
        // Sắp 12 scores lại theo từng đội, cứ 3 scores đầu là cho 1 đội.
        _scoresEachGroup.sort((a, b) => {
          return a.tournament_team_id > b.tournament_team_id ? 1 : -1;
        });
        // 	Tiếp tục chia scores ra thành 4 nhóm theo mỗi đội để lấy tỉ số và độ ưu tiên thằng thua
        // mối nhóm 3 scores cho mỗi đội.
        // 	i === teams length and j === scores(3)
        let imges;
        if (!scoresByGroupsKey) {
          imges = 2;
          for (let i = 0; i < 4; i++) {
            let totalGoals = winner = 0;
            for (let j = i * 3; j < i * 3 + 3; j++) {
              totalGoals += +_scoresEachGroup[j].score;
              winner += +_scoresEachGroup[j].winner;
            }
            teamsInformation.push({
              team: _scoresEachGroup[i * 3],
              score: totalGoals,
              winner: winner
            });
          }
          // Lấy thông tin 2 đội có số winners và scores cao nhất.
          teamsInformation.sort((a, b) => {
            return (b.winner - a.winner) || (b.score - a.score);
          }).splice(2);
        } else {
          imges = (scoresByGroupsKey === 1) ? 3 : 4;
          let indexRound = (scoresByGroupsKey !== 1) ? 2 : 1;
          for (let i = 0; i < indexRound; i++) {
            teamsInformation.push({
              team: _scoresEachGroup[i],
              score: 1,
              // score: +_scoresEachGroup[i].score,
              winner: true,
              // winner: +_scoresEachGroup[i].winner,
            });
          }
          teamsInformation.sort((a, b) => {
            return (b.winner - a.winner) || (b.score - a.score);
          }).splice(1);
        }
  
        let indexSuffixScore = _indexScoresEachGroup + 1;
        if (!!scoresByGroupsKey && indexSuffixScore > 2) indexSuffixScore -= 2;
        // Lặp để set vào từng trận tứ kết.
        teamsInformation.map((eachTeamInformation) => {
          let match = result.filter(match => {
            return match.round === +(`${imges}.${indexSuffixScore}`);
          });
          Score.find({ match_id: match[0].id }, (err, scores) => {
            if (err) throw err;
            // let indexRoundMatch = 0;
            scores[1].tournament_team_id = eachTeamInformation.team.tournament_team_id._id;
            scores[1].home = !indexSuffixScore;
            scores[1].save((error) => {
              if (error) throw error;
            });
            // indexRoundMatch = !(indexSuffixScore % 2) ? 1 : 0;
            indexSuffixScore++;
            if (indexSuffixScore === 3 || indexSuffixScore === 5) {
              indexSuffixScore -= 2;
            };
          });
        });
      }
    });
  });
}
