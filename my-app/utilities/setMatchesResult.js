const Score = require('../models/score.model');

module.exports = function (result, data) {
  let dataScores = {
    scoresByGroupName: [],
    scoresByQuaterFinal: [],
    scoresBySemiFinal: []
  }

  data.map((scoresByGroups, scoresByGroupsKey) => {
    scoresByGroups.map((_scoresEachGroup, _indexScoresEachGroup) => {
      // Tìm xem trong mỗi bảng có trận mô chưa set ko.
      let unSetKnockOut = _scoresEachGroup.filter(score => {
        return score.score === null
      });
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
          dataScores[Object.keys(dataScores)[scoresByGroupsKey]].push(teamsInformation[0], teamsInformation[1]);
        } else {
          imges = (scoresByGroupsKey === 1) ? 3 : 4;
          let indexRound = (scoresByGroupsKey !== 1) ? 2 : 1;
          for (let i = 0; i < indexRound; i++) {
            teamsInformation.push({
              team: _scoresEachGroup[i],
              score: _scoresEachGroup[i] ? +_scoresEachGroup[i].score : null,
              winner: _scoresEachGroup[i] ? +_scoresEachGroup[i].winner : false,
            });
          }
          teamsInformation.sort((a, b) => {
            return (b.winner - a.winner) || (b.score - a.score);
          }).splice(1);
          dataScores[Object.keys(dataScores)[scoresByGroupsKey]].push(teamsInformation);
        }
      }
    });
  });

  let indexsRunning = [0, 1, 1, 0, 0, 1, 1, 0];
  let indexScores = [1, 2, 1, 2, 3, 4, 3, 4];
  let indexsRunningTemp = 0;

  Object.keys(dataScores).forEach((key, index) => {
    if (index === 0) {
      dataScores[key].map(groupNames => {
        let match = result.filter(match => {
          return match.round === +(`2.${indexScores[indexsRunningTemp]}`);
        });
        Score.find({ match_id: match[0].id }, (err, scores) => {
          if (err) throw err;
          if (!scores[1].score) {
            scores[indexsRunning[indexsRunningTemp]].tournament_team_id = groupNames.team.tournament_team_id._id;
            scores[indexsRunning[indexsRunningTemp]].home = !indexsRunningTemp;
            scores[indexsRunning[indexsRunningTemp++]].save((error) => {
              if (error) throw error;
            });
          }
        }).populate('match_id');
      })
    }
  })































}
