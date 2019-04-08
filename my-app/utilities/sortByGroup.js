module.exports = function (data, flag = true) {
  let scoresByGroups = [];
  let totalScoresLength = data.length;
  let runningIndex = (totalScoresLength > 15 && totalScoresLength !== 48) ? 8 : 4;

  for (let i = 0; i < totalScoresLength - 1; i++) {
    let scoresByGroup = [];
    if (flag) {
      for (let j = i; j < (i + totalScoresLength / runningIndex + 1); j++) {
        scoresByGroup.push(data[j]);
      }
    } else {
      for (let j = i; j < (i + totalScoresLength / runningIndex); j++) {
        scoresByGroup.push(data[j]);
      }
    }
    scoresByGroups.push(scoresByGroup);
    i += !(totalScoresLength / runningIndex - 1) ? 1 : totalScoresLength / runningIndex - 1;
    if (i === 2) {
      return;
    }
  }

  return scoresByGroups;
}
