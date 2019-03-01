module.exports = function(totalScores) {
  let scoresByGroups = [];
	let totalScoresLength = totalScores.length;
    for (let i = 0; i < totalScoresLength - 1; i++) {
    	let scoresByGroup = [];
    	for (let j = i; j < (i + totalScoresLength / 4); j++) {
    		scoresByGroup.push(totalScores[j]);
    	}
    	scoresByGroups.push(scoresByGroup);
    	i += (totalScoresLength / 4 - 1);
		}
	return scoresByGroups;
}
