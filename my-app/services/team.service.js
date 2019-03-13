const Team = require('../models/team.model');

module.exports = {
  selectAll: (callback) => {
    console.log(123);
    Team.find(callback);
  },
  createTeam: (body, callback) => {
    const team = new Team(body);
    team.save(callback);
  },
  getTeam: (id, callback) => {
    Team.findOne({_id: id}, callback);
  },
  updateTeam: (id, body, callback) => {
    Team.findByIdAndUpdate(id, body, callback);
  },
  deleteTeam: (id, callback) => {
    Team.deleteOne({_id: id}, callback);
  }
}
