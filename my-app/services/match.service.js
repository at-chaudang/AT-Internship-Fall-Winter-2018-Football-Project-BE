const mongoose = require('mongoose');

const Match = require('../models/match.model');
const Score = require('../models/score.model');
const Team = require('../models/team.model');
const Prediction = require('../models/prediction.model');
const Tournament = require('../models/tournament.model');
const utilities = require('../utilities/index');
const Operator = require('../models/tournament_team.model');

module.exports = {
	selectAll: (callback) => {
		Score.find({ "tournament_team_id": { $ne: null }}).populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id tournamentId' } })
			.then(
				scores => {
					let result = [];
					for (let i = 0; i < scores.length; i++) {
						for (let j = i + 1; j < scores.length; j++) {
							if (scores[i].match_id === scores[j].match_id) {
								result.push({
									tournamentName: scores[i].match_id.tournamentId.name,
									id: scores[i].match_id._id,
									firstTeam: {
										id: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id._id : null,
										code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
										logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : null,
										score: scores[i].score
									},
									secondTeam: {
										id: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id._id : null,
										code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
										logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : null,
										score: scores[j].score
									},
									start_at: scores[j].match_id.start_at
								});
							}
						}
					}
					callback(null, result);
				}
			)
	},
	createMatch: async (body, callback) => {
		let { tournamentId, groups } = JSON.parse(body.data);
		let tournament = await Tournament.findOne({ '_id': tournamentId })
		let startDate = new Date(tournament.start_at - 48 * 3600000).setHours(20, 0, 0, 0);
		groups.map(group => {
			utilities.generateMatchPair(group.tournamentTeamIds, false).map(pair => {
				new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += (46 * 3600000);
				let match = new Match({
					play_at: null,
					round: 1,
					tournamentId: mongoose.Types.ObjectId(tournamentId),
					desc: null,
					start_at: startDate
				});
				match.save((error) => {
					if (error) { throw error };
					for (j = 0; j < 2; j++) {
						let score = new Score({
							match_id: match._id,
							tournament_team_id: pair[j],
							home: !j,
							winner: null,
							score: null
						});
						score.save(err => {
							if (err) throw err;
						});
					}
				});
			});
		})

		let knockouts = groups.length * 2;

		for (let j = 2; j <= 4; j++) {
			knockouts /= 2;
			for (let k = 1; k <= knockouts; k++) {
				new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += (46 * 3600000);
				let match = new Match({
					play_at: null,
					round: +(j + "." + k),
					tournamentId: mongoose.Types.ObjectId(tournamentId),
					desc: null,
					start_at: startDate
				});
				match.save((error) => {
					if (error) { throw error };
					for (j = 1; j < 3; j++) {
						let score = new Score({
							match_id: match._id,
							tournament_team_id: null,
							home: !j,
							winner: null,
							score: null
						});
						score.save(err => {
							if (err) throw err;
						});
					}
				});
			}
		}

		new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += 46 * 3600000;
		let match = new Match({
			play_at: null,
			round: 4.2,
			tournamentId: mongoose.Types.ObjectId(tournamentId),
			desc: null,
			start_at: startDate
		});
		match.save((error) => {
			if (error) { throw error };
			for (j = 1; j < 3; j++) {
				let score = new Score({
					match_id: match._id,
					tournament_team_id: null,
					home: !j,
					winner: null,
					score: null
				});
				score.save(err => {
					if (err) throw err;
				});

				if (j === 2) {
					callback(null, tournamentId);
				}
			}
		});
	},
	getMatch: (id, callback) => {
		Score.find({ match_id: id }).populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id tournament_id' } })
			.then(
				scores => {
					callback(null, scores);
				}
			)
	},
	getAllByTournament: (tournamentId, callback) => {
		Match.find({ tournamentId: tournamentId })
			.then(
				matches => {
					let matchesIds = matches.map(match => match._id);
					return Score.find({ match_id: { $in: matchesIds } })
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } });
				})
			.then(
				scores => {
					let result = [];
					let scoresLength = scores.length

					let scoresOfAllTables = [];
					scores.sort((a, b) => {
						return a.match_id.round > b.match_id.round ? 1 : -1;
					}).map(score => {
						if (score.match_id.round < 2) {
							scoresOfAllTables.push(score)
						} 
						// else if (score.match_id.round < 3) {
						// 	scoresOfAllQuaterFinal.push(score);
						// } else if (score.match_id.round < 4) {
						// 	scoresOfAllSemiFinal.push(score)
						// } else {}
					});

					scoresOfAllTables.sort((a, b) => {
						return a.tournament_team_id.groupName > b.tournament_team_id.groupName ? 1 : -1;
					});

					let { scoresByGroupName } 
					= utilities.arrangeByGroup([scoresOfAllTables]);

					scoresByGroupName[0].sort((a, b) => {
						return a.match_id > b.match_id ? 1 : -1;;
					});

					let teamsInformation = [];
					for (let i = 0; i < scoresByGroupName[0].length; i+=2) {
						let firstTeamPoints = 0;
						let secondTeamPoints = 0;
						if (scoresByGroupName[0][i].score > scoresByGroupName[0][i + 1].score) {
							firstTeamPoints = 3;
							secondTeamPoints = 0
						} else {
							if (scoresByGroupName[0][i].score < scoresByGroupName[0][i + 1].score) {
								firstTeamPoints = 0;
								secondTeamPoints = 3;
							} else {
								firstTeamPoints = secondTeamPoints = 1;
							}
						}

						teamsInformation.push({
							teamId: scoresByGroupName[0][i].tournament_team_id._id,
							points: firstTeamPoints
						}, {
							teamId: scoresByGroupName[0][i + 1].tournament_team_id._id,
							points: secondTeamPoints
						})
					}
					console.log(teamsInformation);
					// teamsInformation.sort((a, b) => {
					// 	a.teamId > b.teamId ? 1 : (a.teamId < b.teamId ? -1 : 0);
					// })
					teamsInformation.sort((a, b) => {
						a.teamId > b.teamId ? 1 : (a.teamId < b.teamId ? -1 : 0);
					})

					console.log(teamsInformation);

					// utilities.setMatchesResult([scoresByGroupName]);
					
					// for (let i = 0; i < scoresLength; i++) {
					// 	for (let j = i + 1; j < scoresLength; j++) {
					// 		if (scores[i].match_id._id === scores[j].match_id._id) {
					// 			Prediction.find({ match_id: scores[i].match_id._id }, (err, prediction) => {
					// 				if (err) throw err;
					// 				result.push({
					// 					id: scores[i].match_id._id,
					// 					round: scores[i].match_id.round,
					// 					group: scores[i].tournament_team_id ? scores[i].tournament_team_id.groupName : null,
					// 					start_at: scores[i].match_id.start_at,
					// 					firstTeam: {
					// 						firstTeamId: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id._id : '',
					// 						code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
					// 						logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
					// 						score: scores[i].score,
					// 						winner: scores[i].winner
					// 					},
					// 					secondTeam: {
					// 						secondTeamId: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id._id : '',
					// 						code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
					// 						logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
					// 						score: scores[j].score,
					// 						winner: scores[j].winner
					// 					},
					// 					prediction: {
					// 						isAllow: (new Date(scores[i].match_id.start_at).getTime() < Date.now()) ? true : false,
					// 						is_predicted: prediction.length ? true : false,
					// 						firstTeam_score_prediction: prediction.length ? prediction[0].score_prediction : '',
					// 						secondTeam_score_prediction: prediction.length ? prediction[1].score_prediction : '',
					// 					}
					// 				});
					// 				if (result.length === scoresLength / 2) {
					// 					callback(null, result);
					// 				}
					// 			})
					// 		}
					// 	}
					// }
				})
	},
	getBracketByTournament: (tournamentId, callback) => {
		Match.find({ tournamentId: tournamentId, round: { $gt: 1 } })
			.then(
				matches => {
					let matchesIds = matches.map(match => match._id);
					return Score.find({ match_id: { $in: matchesIds } })
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } });
				})
			.then(
				scores => {
					let result = [];
					let winner = {};
					let ptk = pbk = pck = position = 0;

					for (let i = 0; i < scores.length; i++) {
						for (let j = i + 1; j < scores.length; j++) {
							if (scores[i].match_id === scores[j].match_id) {
								let label;

								if (scores[i].match_id.round <= 3) {
									label = 'tk';
									position = ++ptk;
									++ptk;
								} else if (scores[i].match_id.round <= 4) {
									label = 'bk';
									position = ++pbk;
									++pbk;
								} else {
									label = 'ck';
									position = ++pck;
									++pck;
								}

								result.push({
									label,
									position: position,
									code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
									logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
									score: scores[i].score
								}, {
										label,
										position: ++position,
										code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
										logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
										score: scores[j].score
									});
							}
						}
					}
					Tournament.find({ _id: tournamentId }, (err, tournament) => {
						if (err) throw err;
						callback(null, {
							tournamentName: tournament.name,
							matches: result,
							winner: winner
						});
					});
				}
			)
	},
	updateMatch: (body, callback) => {
		Score.find({ match_id: body.match_id }, (err, scores) => {
			if (err) throw err;
			scores.map((score, index) => {
				score.score = body.scorePrediction[index];
				score.winner = body.winners[index] === 'true' ? true : false;
				score.save(err => {
					if (err) throw err;
				});
			});
		});
		callback(null, 200);
	},
	getNextMatch: (callback) => {
		Match.find({start_at: { $gt: Date.now() } })
			.then(
				matches => {
					let matchesIds = matches.map(match => match._id);
					return Score.find({ match_id: { $in: matchesIds }, tournament_team_id: { $ne: null } })
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'tournamentId team_id' } }).limit(14);
				})
			.then(
				scores => {
					let result = [];
					for (let i = 0; i < scores.length; i++) {
						for (let j = i + 1; j < scores.length; j++) {
							if (scores[i].match_id === scores[j].match_id) {
								Prediction.find({ match_id: scores[i].match_id._id }, (err, prediction) => {
									if (err) throw err;
									result.push({
										id: scores[i].match_id._id,
										round: scores[i].match_id.round,
										tournamentName: scores[i].match_id.tournamentId.name,
										firstTeam: {
											firstTeamId: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.id : null,
											code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
											logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
											score: scores[i].score
										},
										secondTeam: {
											secondTeamId: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.id : null,
											code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
											logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
											score: scores[j].score
										},
										start_at: scores[i].match_id.start_at,
										prediction: {
											is_predicted: prediction.length ? true : false,
											firstTeam_score_prediction: prediction.length ? prediction[0].score_prediction : '',
											secondTeam_score_prediction: prediction.length ? prediction[1].score_prediction : '',
										}
									});
									if (result.length == scores.length / 2) {
										callback(null, result);
									}
								});
							}
						}
					}
				}
			);
	},
	deleteMatch: (id, callback) => {
		Match.deleteOne({ _id: id }, callback);
	},
	deleteByTournament: (id, callback) => {
		Match.find({ tournamentId: id }).then(matches => {
			let matchesIds = matches.map(match => match._id);
			Score.find({ match_id: { $in: matchesIds } }, (err, scores) => {
				if (err) throw err;
				scores.map(score => Score.deleteOne({_id: score._id}, (err => {
					if (err) throw err;
				})));
			});
			Prediction.find({ match_id: { $in: matchesIds } }, (err, predictions) => {
				if (err) throw err;
				predictions.map(prediction => Prediction.deleteOne({_id: prediction._id}, (err => {
					if (err) throw err;
				})));
			});
			Match.deleteMany({ tournamentId: id }, (err) => {
				if (err) throw err;
			});
		});

		Operator.find({ tournament_id: id }, (err, operators) => {
			if (err) throw err;
			let teamIds = operators.map(operator => operator.team_id);
			Team.find({ _id: { $in: teamIds } }, (err, teams) => {
				if (err) throw err;
				teams.map(team => Team.deleteOne({_id: team._id}, (err => {
					if (err) throw err;
				})));
			});
			Operator.deleteMany({ tournament_id: id }, (err) => {
				if (err) throw err;
			});
		});

		Tournament.deleteOne({ _id: id}, (err) => {
			if (err) throw err;
			callback(null, 200);
		});
	}
}
