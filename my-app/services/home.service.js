const mongoose = require('mongoose');

const Match = require('../models/match.model');
const Score = require('../models/score.model');
const Team = require('../models/team.model');
const Prediction = require('../models/prediction.model');
const Tournament = require('../models/tournament.model');
const utilities = require('../utilities/index');
const Operator = require('../models/tournament_team.model');
const oneYear = 3600*24*365*1000;

module.exports = {
	getLatestResultOfMatch: (callback) => {
		Match.find({ start_at: { $lt: Date.now(), $gt: Date.now() - oneYear } }).sort({ start_at: -1 }).limit(1)
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
}
