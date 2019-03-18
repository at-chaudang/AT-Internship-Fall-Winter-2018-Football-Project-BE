const mongoose = require('mongoose');

const Match = require('../models/match.model');
const Score = require('../models/score.model');
const Prediction = require('../models/prediction.model');
const Tournament = require('../models/tournament.model');
const utilities = require('../utilities/index');

module.exports = {
	selectAll: (callback) => {
		Match.find(callback);
	},
	createMatch: async (body, callback) => {
		let { tournamentId, groups } = JSON.parse(body.data);
		let tournament = await Tournament.findOne({ '_id': tournamentId })
		let startDate = new Date(tournament.start_at - 48 * 3600000).setHours(20, 0, 0, 0);
		groups.map(group => {
			utilities.generateMatchPair(group.tournamentTeamIds, false).map(pair => {
				new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += 46 * 3600000;
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
				new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate += 46 * 3600000;
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
		Score.find({ match_id: id }).populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } })
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

					// Sắp xếp theo từng trận tứ kết.
					// let scoresByQuaterFinal = scores.filter(score => (score.match_id.round > 1 && score.match_id.round < 3))
					// .sort((a, b) => {
					// 	return a.match_id.round > b.match_id.round ? 1 : -1;
					// });

					// let scoresCuaToanBoVongTuKetTheoNhom = [];
					// for (let i = 0; i < scoresByQuaterFinal.length - 1; i++) {
					// 	let scoresCuaMoiTranTuKet = [];
					// 	for (let j = i; j + 3; j++) {
					// 		scoresCuaMoiTranTuKet.push(scoresByQuaterFinal[j]);
					// 	}
					// 	scoresCuaToanBoVongTuKetTheoNhom.push(scoresCuaMoiTranTuKet);
					// 	i+= 2;
					// }

					// Sắp xếp theo tên bảng.
					// let scoresCuaToanBoVongBang = scores
					// 	.filter(score => score.match_id.round === 1)
					// 	.sort((a, b) => {
					// 		return a.tournament_team_id.groupName > b.tournament_team_id.groupName ? 1 : -1;
					// 	});
					
					// // Chia nhóm theo bên bảng.
					// let scoresCuaToanBoBangTheoNhom = [];
					// for (let i = 0; i < scoresCuaToanBoVongBang.length - 1; i++) {
					// 	let scoresCuaMoiBang = []
					// 	for (let j = i; j < i + 12; j++) {
					// 		scoresCuaMoiBang.push(scoresCuaToanBoVongBang[j]);
					// 	}
					// 	scoresCuaToanBoBangTheoNhom.push(scoresCuaMoiBang);
					// 	i += 11;
					// }
					for (let i = 0; i < scoresLength; i++) {
						for (let j = i + 1; j < scoresLength; j++) {
							if (scores[i].match_id._id === scores[j].match_id._id) {
								Prediction.find({ match_id: scores[i].match_id._id }, (err, prediction) => {
									if (err) throw err;
									result.push({
										id: scores[i].match_id._id,
										round: scores[i].match_id.round,
										group: scores[i].tournament_team_id ? scores[i].tournament_team_id.groupName : null,
										start_at: scores[i].match_id.start_at,
										firstTeam: {
											firstTeamId: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id._id : '',
											code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
											logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
											score: scores[i].score
										},
										secondTeam: {
											secondTeamId: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id._id : '',
											code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
											logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/default-image.png',
											score: scores[j].score
										},
										prediction: {
											isAllow: (new Date(scores[i].match_id.start_at).getTime() < Date.now()) ? true : false,
											is_predicted: prediction.length ? true : false,
											firstTeam_score_prediction: prediction.length ? prediction[0].score_prediction : '',
											secondTeam_score_prediction: prediction.length ? prediction[1].score_prediction : '',
										}
									});
									if (result.length === scoresLength / 2) {
										// Lặp từng mỗi nhóm bảng.
										// scoresCuaToanBoBangTheoNhom.map((_scoresCuaMoiBang, _indexscoresCuaMoiBang) => {
										// 	// Tìm xem trong mỗi bảng có trận mô chưa set ko.
										// 	let unSetKnockOut = _scoresCuaMoiBang.filter(score => {
										// 		return score.score === null
										// 	})
										// 	if (!unSetKnockOut.length) {
										// 		let thongTinCacDoi = [];

										// 		// Sắp 12 scores lại theo từng đội, cứ 3 scores đầu là cho 1 đội.
										// 		_scoresCuaMoiBang.sort((a, b) => {
										// 			return a.tournament_team_id > b.tournament_team_id ? 1 : -1;
										// 		});

										// 		// Tiếp tục chia scores ra thành 4 nhóm theo mỗi đội để lấy tỉ số và độ ưu tiên thằng thua
										// 	// mối nhóm 3 scores cho mỗi đội.
										// 		// i === teams length and j === scores(3)
										// 		for (let i = 0; i < 4; i++) {
										// 			let tongBanThang = winner = 0;
										// 			for (let j = i * 3; j < i * 3 + 3; j++) {
										// 				tongBanThang += +_scoresCuaMoiBang[j].score;
										// 				winner += +_scoresCuaMoiBang[j].winner;
										// 			}
										// 			thongTinCacDoi.push({
										// 				team: _scoresCuaMoiBang[i * 3],
										// 				score: tongBanThang,
										// 				winner: winner
										// 			});
										// 		}

										// 		// Lấy thông tin 2 đội có số winners và scores cao nhất.
										// 		thongTinCacDoi.sort((a, b) => {
										// 			return (b.winner - a.winner) || (b.score - a.score);
										// 		}).splice(2);

										// 		let indexScore = _indexscoresCuaMoiBang + 1
										// 		let indexTemp = 1;
										// 		// Lặp để set vào từng trận tứ kết.
										// 		thongTinCacDoi.map(thongTinMoiDoi => {
										// 			let resultIndex = result.findIndex(match => {
										// 				return match.round === +(`2.${indexScore}`);
										// 			});

										// 			let teamTemp = result[resultIndex][Object.keys(result[resultIndex])[indexTemp + 3]];
										// 			teamTemp[(Object.keys(teamTemp)[0])] = thongTinMoiDoi.team._id;
										// 			teamTemp.code = thongTinMoiDoi.team.tournament_team_id.team_id.code;
										// 			teamTemp.logo = thongTinMoiDoi.team.tournament_team_id.team_id.logo;
										// 			indexTemp++;
										// 			indexScore++;
										// 			if (indexScore === 3 || indexScore === 5) { 
										// 				indexScore-= 2;
										// 			};
										// 		});
										// 	}
										// })

										// scoresCuaToanBoVongTuKetTheoNhom.map((_scoresCuaMoiTranTuKet, _indexscoresCuaMoiTranTuKet) => {
											
										// })

										callback(null, result);
									}
								})
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
				// score.winner = body.winners[index];
				score.save(err => {
					if (err) throw err;
				});
			});
		});
		callback(null, 200);
	},
	getNextMatch: (callback) => {
		Match.find(
			{
				start_at: { $gt: Date.now() }
			}
		)
			.limit(7)
			.then(
				matches => {
					let matchesIds = matches.map(match => match._id);
					return Score.find({
						match_id: { $in: matchesIds }
					})
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } });
				})
			.then(
				scores => {
					let result = [];
					for (let i = 0; i < scores.length; i++) {
						for (let j = i + 1; j < scores.length; j++) {
							if (scores[i].match_id === scores[j].match_id) {
								result.push({
									id: scores[i].match_id._id,
									round: scores[i].match_id.round,
									firstTeam: {
										firstTeamId: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id._id : '',
										code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
										logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
										score: scores[i].score
									},
									secondTeam: {
										secondTeamId: scores[i].tournament_team_id ? scores[j].tournament_team_id.team_id._id : '',
										code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
										logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
										score: scores[j].score
									},
									start_at: scores[i].match_id.start_at,
								});
							}
						}
					}
					result = result.filter(match => match.firstTeam.code);
					callback(null, result);
				}
			)
			;
	},
	deleteMatch: (id, callback) => {
		Match.deleteOne({ _id: id }, callback);
	},
	deleteByTournament: (id, callback) => {
		Match.deleteMany({ tournamentId: id}, (err) => {
			if (err) throw err;
		})
	}
}
