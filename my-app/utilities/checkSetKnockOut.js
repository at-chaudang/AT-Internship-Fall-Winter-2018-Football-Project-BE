const sortKindOfMatches = require('../utilities/sortKindOfMatches');
const sortByGroup = require('../utilities/sortByGroup');
module.exports = function (scores) {
  let { scoresOfAllTables } = sortKindOfMatches(scores);
  let scoresByGroupName = sortByGroup(scoresOfAllTables, false);
  let tableFlags = [];

  scoresByGroupName.map((_scoresEachGroup, index) => {
    let setEachTable = _scoresEachGroup.find(
      score => score.score === null
    ) ? false : true;
    tableFlags.push({ groupIndex: index, finished: setEachTable });
  });

  return tableFlags;
}
