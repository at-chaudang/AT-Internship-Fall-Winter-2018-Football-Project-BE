const mongoose = require('mongoose');

const Tournament = require('../models/tournament.model');
const Team = require('../models/team.model');
const Operator = require('../models/tournament_team.model');

const utilities = require('../utilities/index');

module.exports = {
  selectAll: (callback) => {
    Tournament.find({}, callback);
  },
  createTournament: (req, callback) => {
    let { tournament, teams } = req.body;

    let groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let tournamentId;
    let teamIds = [];
    let groups = [];
    let j = 0;

    let tournamentInstance = new Tournament({
      name: tournament.name,
      start_at: tournament.start_at,
      end_at: tournament.end_at,
      group_number: tournament.group_number,
      desc: tournament.desc
    });
    tournamentId = tournamentInstance._id;
    tournamentInstance.save(err => {
      if (err) throw err;
    });

    teams.map(team => {
      let teamInstance = new Team({
        name: team.name,
        code: team.code,
        cover: team.cover,
        logo: team.logo
      });
      teamIds.push(teamInstance._id);
      teamInstance.save(err => {
        if (err) throw err;
      });
    });

    for (let i = 0; i < tournament.group_number; i++) {
      let _tournamentTeamIds = [];
      for (j; j < ((i * 4) + 4); j++) {
        let tournamentTeamInstance = new Operator({
          tournament_id: tournamentId,
          team_id: teamIds[j],
          groupName: groupNames[i]
        });
        _tournamentTeamIds.push(tournamentTeamInstance._id);
        tournamentTeamInstance.save(err => {
          if (err) throw err;
        });
      }
      groups.push({
        groupName: groupNames[i],
        tournamentTeamIds: _tournamentTeamIds
      });
    }

    callback(null, { tournamentId, groups });
  },
  getTournament: (id, callback) => {
    Tournament.find({ _id: id }, callback);
  },
  updateTournament: (id, body, callback) => {
    Tournament.findByIdAndUpdate(id, body, callback);
  },
  deleteTournament: (id, callback) => {
    Tournament.deleteOne({ _id: id }, callback)
  }
}
