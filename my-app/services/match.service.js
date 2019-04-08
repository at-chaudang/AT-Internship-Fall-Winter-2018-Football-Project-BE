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
		Score.find({ "tournament_team_id": { $ne: null } }).populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id tournamentId' } })
			.then(
				scores => {
					let result = [];
					for (let i = 0; i < scores.length; i++) {
						for (let j = i + 1; j < scores.length; j++) {
							if (scores[i].match_id === scores[j].match_id && scores[j].tournament_team_id) {
								result.push({
									tournamentName: scores[i].match_id ? scores[i].match_id.tournamentId.name : null,
									id: scores[i].match_id ? scores[i].match_id._id : null,
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
									start_at: scores[j].match_id ? scores[j].match_id.start_at : null
								});
							}
						}
					}
					callback(null, result);
				}
			)
	},
	showDonePercentMatches: (callback) => {
		Tournament.find({}, (err, tours) => {
			if (err) throw err;
			let responsedData = []
			let tourLength = tours.length;
			if (!tourLength) callback(null);
			for (let i = 0, p = Promise.resolve(); i < tours.length; i++) {
				p = p.then(_ => new Promise(resolve => {
					tourInfo = [];
					Match.find({ tournamentId: tours[i]._id }, ((err, matches) => {
						if (err) throw err;
						let matchesIds = matches.map(match => match._id);
						Score.find({ match_id: { $in: matchesIds } }, (err, scores) => {
							if (err) throw err;
							let scoredScores = scores.filter(score => score.score);
							let percent = scoredScores.length / scores.length * 100;
							let status = percent === 100 ? 1 : 0;
							responsedData.push({ name: tours[i].name, _id: tours[i]._id, start_at: tours[i].start_at, percent: Math.round(percent), status: status });
							resolve();
							if (responsedData.length == tours.length) {
								callback(null, responsedData);
							}
						})
					}))
				}));
			}
		})
	},
	createMatch: async (body, callback) => {
		let { tournamentId, groups } = JSON.parse(body.data);
		let tournament = await Tournament.findById(tournamentId)
		let startDate = new Date(tournament.start_at - 48 * 3600000).setHours(20, 0, 0, 0);
		let dateRandom = [];
		let size = groups.length * 6;
		for (let index = 0; index < size; index++) {
			dateRandom[index] = new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += (46 * 3600000);
		}
		// xáo trộn date ======================
		let temp = [];
		for (let index = 0; index < groups.length; index++) {
			DateIndex = index;
			for (let j = 0; j < 6; j++) {
				temp.push(dateRandom[DateIndex]);
				DateIndex += 4;
			}
		}
		// =====================
		groups.map((group, groupIndex) => {
			utilities.generateMatchPair(group.tournamentTeamIds, false).map((pair, i) => {
				let match = new Match({
					play_at: null,
					round: 1,
					tournamentId: mongoose.Types.ObjectId(tournamentId),
					desc: null,
					start_at: temp[groupIndex * 6 + i]
				});
				match.save((error) => {
					if (error) { throw error };
					for (j = 0; j < 2; j++) {
						let score = new Score({
							match_id: match._id,
							tournament_team_id: pair[j],
							home: !j,
							winner: null,
							score: null,
							// score: 1
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
					for (j = 0; j < 2; j++) {
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

		// Create finally match
		new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += 46 * 3600000;
		let match = new Match({
			play_at: null,
			round: groups.length === 8 ? 5.1 : 4.2,
			// round: groups.length === 8 ? 5.1 : 4.1,
			tournamentId: mongoose.Types.ObjectId(tournamentId),
			desc: null,
			start_at: startDate
		});
		match.save((error) => {
			if (error) { throw error };
			for (j = 0; j < 2; j++) {
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

				if (j === 1) {
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
	getTopTeamsByGroup: (tournamentId, callback) => {
		Match.find({ tournamentId: tournamentId })
			.then(
				matches => {
					let matchesIds = matches.map(match => match._id);
					return Score.find({ match_id: { $in: matchesIds } })
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } });
				})
			.then(
				scores => {
					if (!scores.length) return;
					let { scoresOfAllTables } = utilities.sortKindOfMatches(scores);
					let scoresByGroupName = utilities.sortByGroup(scoresOfAllTables, false);
					let responsingData = [];
					scoresByGroupName.map((_scoresEachGroup) => {
						let teamsInformationOfTwelve = utilities.calcScore(_scoresEachGroup);
						utilities.getTopTeams(teamsInformationOfTwelve, 0, 4).map(teamsInformation => {
							// console.log(
							// 	'teamsInformation',
							// 	JSON.stringify(teamsInformation, null, 4)
							// );
							responsingData.push(teamsInformation);
						});
					})
					callback(null, responsingData);
				}
			)
	},
	getAllByTournament: (tournamentId, callback) => {
		Match.find({ tournamentId: tournamentId })
			.then(
				matches => {
					let matchesIds = matches.map(match => match._id);
					return Score.find({ match_id: { $in: matchesIds } })
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id tournamentId' } });
				})
			.then(
				async scores => {
					if (!scores.length) return;
					let tournamentName = scores[0].match_id.tournamentId.name || '';
					let result = [];
					let scoresLength = scores.length;
					let tablesFlags = utilities.checkSetKnockOut(scores);
					let isSetMatchesResult = await utilities.setMatchesResult(scores);
					let newScores = await Match.find({ tournamentId: tournamentId })
						.then(
							matches => {
								test = 1;
								let matchesIds = matches.map(match => match._id);
								return Score.find({ match_id: { $in: matchesIds } })
									.populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id tournamentId' } });
							})
						if (isSetMatchesResult && isSetMatchesResult.err) {
							console.log('error');
						} else {
						for (let i = 0; i < scoresLength; i++) {
							for (let j = i + 1; j < scoresLength; j++) {
								if (newScores[i].match_id._id === newScores[j].match_id._id) {
									Prediction.find({ match_id: newScores[i].match_id._id }, (err, prediction) => {
										if (err) throw err;
										result.push({
											id: newScores[i].match_id._id,
											round: newScores[i].match_id.round,
											group: newScores[i].tournament_team_id ? newScores[i].tournament_team_id.groupName : null,
											start_at: newScores[i].match_id.start_at,
											isKnockoutSet: newScores[i].tournament_team_id ? newScores[i].tournament_team_id.isKnockoutSet : false,
											firstTeam: newScores[i].home ? {
												firstTournamentTeamId: newScores[i].tournament_team_id ? newScores[i].tournament_team_id._id : null,
												firstTeamId: newScores[i].tournament_team_id ? newScores[i].tournament_team_id.team_id._id : '',
												code: newScores[i].tournament_team_id ? newScores[i].tournament_team_id.team_id.code : null,
												logo: newScores[i].tournament_team_id ? `../../../assets/images/${newScores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
												score: newScores[i].score,
												winners: newScores[i].winner,
												home: true
											} : {
													firstTournamentTeamId: newScores[j].tournament_team_id ? newScores[j].tournament_team_id._id : null,
													firstTeamId: newScores[j].tournament_team_id ? newScores[j].tournament_team_id.team_id._id : '',
													code: newScores[j].tournament_team_id ? newScores[j].tournament_team_id.team_id.code : null,
													logo: newScores[j].tournament_team_id ? `../../../assets/images/${newScores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
													score: newScores[j].score,
													winners: newScores[j].winner,
													home: true
												},
											secondTeam: newScores[i].home ? {
												secondTournamentTeamId: newScores[j].tournament_team_id ? newScores[j].tournament_team_id._id : null,
												secondTeamId: newScores[j].tournament_team_id ? newScores[j].tournament_team_id.team_id._id : '',
												code: newScores[j].tournament_team_id ? newScores[j].tournament_team_id.team_id.code : null,
												logo: newScores[j].tournament_team_id ? `../../../assets/images/${newScores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
												score: newScores[j].score,
												winners: newScores[j].winner,
												home: false
											} : {
													secondTournamentTeamId: newScores[i].tournament_team_id ? newScores[i].tournament_team_id._id : null,
													secondTeamId: newScores[i].tournament_team_id ? newScores[i].tournament_team_id.team_id._id : '',
													code: newScores[i].tournament_team_id ? newScores[i].tournament_team_id.team_id.code : null,
													logo: newScores[i].tournament_team_id ? `../../../assets/images/${newScores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
													score: newScores[i].score,
													winners: newScores[i].winner,
													home: false
												},
											prediction: {
												isAllow: (new Date(newScores[i].match_id.start_at).getTime() < Date.now()) ? true : false,
												is_predicted: prediction.length ? true : false,
												firstTeam_score_prediction: prediction.length ? prediction[0].score_prediction : '',
												secondTeam_score_prediction: prediction.length ? prediction[1].score_prediction : '',
											}
										});
										if (result.length === scoresLength / 2) {
											callback(null, [tournamentName, result, tablesFlags]);
										}
									})
								}
							}
						}
					}
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
					scores.sort((a, b) => {
						return a.match_id.round - b.match_id.round
					});

					let flag = scores.length > 16 ? true : false;
					let result = [];
					let winner;
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

									if (flag) {
										if ((scores[i].match_id.round == 5.1)) {
											if (scores[i].score != null && scores[i].winner) {
												winner = {
													code: scores[i].tournament_team_id.team_id.code,
													logo: scores[i].tournament_team_id.team_id.logo
												};
											} else if (scores[j].score != null && scores[j].winner) {
												winner = {
													code: scores[j].tournament_team_id.team_id.code,
													logo: scores[j].tournament_team_id.team_id.logo
												};
											}
										}
									} else if ((scores[i].match_id.round == 4.1)) {
										if (scores[i].winner) {
											winner = {
												code: scores[i].tournament_team_id.team_id.code,
												logo: scores[i].tournament_team_id.team_id.logo
											};
										} else if (scores[j].winner) {
											winner = {
												code: scores[j].tournament_team_id.team_id.code,
												logo: scores[j].tournament_team_id.team_id.logo
											};
										}
									}
								}

								result.push(
									{
										label,
										position: position,
										code: scores[i].home
											? (
												scores[i].tournament_team_id
													? scores[i].tournament_team_id.team_id.code
													: null
											)
											: (
												scores[j].tournament_team_id
													? scores[j].tournament_team_id.team_id.code
													: null
											),
										logo: scores[i].home
											? (
												scores[i].tournament_team_id
													? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}`
													: '../../../assets/images/default-image.png'
											)
											: (
												scores[j].tournament_team_id
													? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}`
													: '../../../assets/images/default-image.png'
											),
										score: scores[i].home ? scores[i].score : scores[j].score
									},
									{
										label,
										position: ++position,
										code: scores[i].home
											? (
												scores[j].tournament_team_id
													? scores[j].tournament_team_id.team_id.code
													: null
											)
											: (
												scores[i].tournament_team_id
													? scores[i].tournament_team_id.team_id.code
													: null
											),
										logo: scores[i].home
											? (
												scores[j].tournament_team_id
													? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}`
													: '../../../assets/images/default-image.png'
											)
											: (
												scores[i].tournament_team_id
													? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}`
													: '../../../assets/images/default-image.png'
											),
										score: scores[j].home ? scores[i].score : scores[j].score
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
	updateMatch: async (body, callback) => {
		if (body.start_at) {
			await Match.findOne({ _id: body.match_id }, (err, match) => {
				if (err) throw err;
				match.start_at = body.start_at;
				match.save(err => { if (err) throw err })
			});
		}

		await Score.find({ match_id: body.match_id }, (err, scores) => {
			if (err) throw err;
			scores.map(score => {
				// score.tournament_team_id = null;
				// score.score = null;
				// score.home = !i;
				score.score = score.home ? body.scorePrediction[0] : body.scorePrediction[1];
				score.winner = score.home ? body.winners[0] : body.winners[1];
				score.save(err => {
					if (err) throw err;
				});
			});
		});
		callback(null, 200);
	},
	getNextMatch: (callback) => {
		Match.find({ start_at: { $gt: Date.now() } }).sort({ start_at: 1 }).limit(8)
			.then(
				matches => {
					let matchesIds = matches.map(match => match._id);
					return Score.find({ match_id: { $in: matchesIds }, tournament_team_id: { $ne: null } })
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'tournamentId team_id' } });
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
											user_id: prediction.length ? prediction[0].user_id : null,
											firstTeam_score_prediction: prediction.length ? prediction[0].score_prediction : '',
											secondTeam_score_prediction: prediction.length ? prediction[1].score_prediction : '',
										}
									});
									if (result.length === scores.length / 2) {
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
				scores.map(score => Score.deleteOne({ _id: score._id }, (err => {
					if (err) throw err;
				})));
			});
			Prediction.find({ match_id: { $in: matchesIds } }, (err, predictions) => {
				if (err) throw err;
				predictions.map(prediction => Prediction.deleteOne({ _id: prediction._id }, (err => {
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
				teams.map(team => Team.deleteOne({ _id: team._id }, (err => {
					if (err) throw err;
				})));
			});
			Operator.deleteMany({ tournament_id: id }, (err) => {
				if (err) throw err;
			});
		});

		Tournament.deleteOne({ _id: id }, (err) => {
			if (err) throw err;
			callback(null, 200);
		});
	}
}
