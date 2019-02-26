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
		let tournament = await Tournament.findOne({'_id': tournamentId})
		let startDate= new Date(tournament.start_at - 48*3600000).setHours(20,0,0,0);
		groups.map(group => {
			utilities.generateMatchPair(group.tournamentTeamIds, false).map(pair => {
				new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate+= 46*3600000;
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
				new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate+= 46*3600000;
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

		new Date(startDate).getHours() === 18 ? startDate += 7200000 : startDate+= 46*3600000;
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
			}
		});

		callback(null, tournamentId);
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
					let scoresLength = scores.length;
					for (let i = 0, p = Promise.resolve(); i < scoresLength; i++) {
						for (let j = i + 1; j < scoresLength; j++) {
							if (scores[i].match_id._id === scores[j].match_id._id) {
								p = p.then(_ => new Promise(resolve => {
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
												logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
												score: scores[i].score
											},
											secondTeam: {
												secondTeamId: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id._id : '',
												code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
												logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
												score: scores[j].score
											},
											prediction: {
												is_predicted: prediction.length ? true : false,
												firstTeam_score_prediction: prediction.length ? prediction[0].score_prediction : '',
												secondTeam_score_prediction: prediction.length ? prediction[1].score_prediction : '',
											}
										});
										resolve();
										if (result.length == scoresLength / 2) {
											callback(null, result);
										}
									})
								}))
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
									logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
									score: scores[i].score
								}, {
										label,
										position: ++position,
										code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
										logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
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
		Score.find({ match_id: body.match_id }, (err, callback) => {
			if (err) throw err;
			callback.map((score, index) => {
				score.score = body.scorePrediction[index];
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
					return Score.find({ match_id: { $in: matchesIds } })
						.populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } });
				})
			.then(
				scores => {
					let result = [];
					for (let i = 0; i < scores.length; i++) {
						for (let j = i + 1; j < scores.length; j++) {
							if (scores[i].match_id === scores[j].match_id) {
								result.push({
									round: scores[i].match_id.round,
									firstTeam: {
										code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
										logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
										score: scores[i].score
									},
									secondTeam: {
										code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
										logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
										score: scores[j].score
									},
									start_at: scores[i].match_id.start_at
								});
							}
						}
					}
					callback(null, result);
				}
			)
			;
	},
	deleteMatch: (id, callback) => {
		Match.deleteOne({ _id: id }, callback);
	}
}
