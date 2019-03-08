module.exports = function(data) {
	let dataScores = {
		scoresByGroupName: [], 
		scoresByQuaterFinal: [], 
		scoresBySemiFinal: []
	}

	Object.keys(dataScores).forEach((key, index) => {
		let scoresByGroups = [];
		let totalScoresLength = data[index].length;
			for (let i = 0; i < totalScoresLength - 1; i++) {
				let scoresByGroup = [];
				if (index === 2) {
					for (let j = i; j < (i + totalScoresLength / 4 + 1); j++) {
						scoresByGroup.push(data[index][j]);
					}
				} else {
					for (let j = i; j < (i + totalScoresLength / 4); j++) {
						scoresByGroup.push(data[index][j]);
					}
				}
				scoresByGroups.push(scoresByGroup);
				i += !(totalScoresLength / 4 - 1) ? 1 : totalScoresLength / 4 - 1;
				if (i === 2) {
					return;
				}
			}
			dataScores[key] = scoresByGroups;
	})
	return dataScores;
}
