const mongoose = require('mongoose');

const Match = require('../models/match.model');
const Score = require('../models/score.model');
const Operator = require('../models/tournament_team.model');
const Tournament = require('../models/tournament.model');
const utilities = require('../utilities/index');

module.exports = {
  selectAll: (callback) => {
    Match.find(callback);
  },
  createMatch: (body, callback) => {
    let { tournamentId, groups } = JSON.parse(body.data);

    groups.map(group => {
      utilities.generateMatchPair(group.tournamentTeamIds, false).map(pair => {
        let match = new Match({
          play_at: null,
          round: 1,
          tournamentId: mongoose.Types.ObjectId(tournamentId),
          desc: null,
          start_at: null
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
        let match = new Match({
          play_at: null,
          round: +(j + "." + k),
          tournamentId: mongoose.Types.ObjectId(tournamentId),
          desc: null,
          start_at: null
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

    let match = new Match({
      play_at: null,
      round: 4.2,
      tournamentId: mongoose.Types.ObjectId(tournamentId),
      desc: null,
      start_at: null
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
    Match.find({ _id: id }, callback);
  },
  getBracketByTournament: (tournamentId, callback) => {
    Match.find({ tournamentId: tournamentId, round: { $gt: 1 }})
      .then(
      matches => {
        let matchesIds = matches.map(match => match._id);
        return Score.find({ match_id: { $in: matchesIds } })
          .populate({ path: 'tournament_team_id match_id', populate: { path: 'team_id' } });
      })
      .then(
        scores => {
        console.log(scores.length);
        let result = [];
        let winner = {};

        for (let i = 0; i < scores.length; i++) {
          for (let j = i + 1; j < scores.length; j++) {
            if (scores[i].match_id === scores[j].match_id) {
              result.push({
                id: scores[i].match_id.round,
                firstTeam: {
                  code: scores[i].tournament_team_id ? scores[i].tournament_team_id.team_id.code : null,
                  logo: scores[i].tournament_team_id ? `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
                  score: scores[i].score
                },
                secondTeam: {
                  code: scores[j].tournament_team_id ? scores[j].tournament_team_id.team_id.code : null,
                  logo: scores[j].tournament_team_id ? `../../../assets/images/${scores[j].tournament_team_id.team_id.logo}` : '../../../assets/images/logo-img.png',
                  score: scores[j].score
                }
              });
            }
          }
          if (scores[i].match_id.round === 4.1 && scores[i].winner) {
            winner = {
              code: scores[i].tournament_team_id.team_id.code || null,
              logo: `../../../assets/images/${scores[i].tournament_team_id.team_id.logo}` || null
            };
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
  updateMatch: (id, body, callback) => {
    Match.findByIdAndUpdate(id, body, callback);
  },
  deleteMatch: (id, callback) => {
    Match.deleteOne({ _id: id }, callback);
  }
}
