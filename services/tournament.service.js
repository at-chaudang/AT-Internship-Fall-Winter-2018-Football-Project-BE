const mongoose = require('mongoose');

const Tournament = require('../models/tournament.model');
const Team = require('../models/team.model');

const utilities = require('../utilities/index');

module.exports = {
  selectAll: (callback) => {
    Tournament.find(callback);
  },
  createTournament: (req, callback) => {
    let { tournament, teams } = req.body;

    let groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let groups = [];
    let j = 0;

    let teamIds = []
    let tournamentId;
    let schedules = [];
    
    let tournamentInstance = new Tournament({
      _id: new mongoose.Types.ObjectId(),
      groupNumber: 4
    });
    tournamentId = tournamentInstance._id;
    tournamentInstance.save(err => {
      if (err) throw err;
    });
    
    teams.map(team => {
      let teamInstance = new Team({
        _id: new mongoose.Types.ObjectId(),
        name: team
      });
      teamIds.push(teamInstance._id);
      teamInstance.save(err => {
        if (err) throw err;
      });
    });

    for (let i = 0; i < tournament.groupNumber; i++) {
      groups.push({
        groupName: groupNames[i],
        teamIds: [
          teamIds[j],
          teamIds[j + 1],
          teamIds[j + 2],
          teamIds[j + 3]
        ]
      });
      j += 4;
    }

    groups.map(group => {
      utilities.generateMatchPair(group.groupName, group.teamIds, false)
        .map(data => {
          schedules.push(data);
        });
    });

    callback(null, { tournamentId, schedules });
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
