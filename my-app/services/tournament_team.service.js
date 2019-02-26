const TournamentTeam = require('./../models/tournament_team.model');

module.exports = {
  selectAll: (callback) => {
    TournamentTeam.find(callback);
  },
  createTournamentTeam: (body, callback) => {
    const match = new TournamentTeam(body);
    match.save(callback);
  },
  getTournamentTeam: (id, callback) => {
    TournamentTeam.find({_id: id}, callback);
  },
  getTeamsByTournamentId: (id, callback) => {
    TournamentTeam.find({tournament_id: id}).populate('team_id').then(team => {
      console.log(team)
      callback(null, team);
    });
  },
  updateTournamentTeam: (id, body, callback) => {
    TournamentTeam.findByIdAndUpdate(id, body, callback);
  },
  deleteTournamentTeam: (id, callback) => {
    TournamentTeam.deleteOne({_id: id}, callback);
  }
}
