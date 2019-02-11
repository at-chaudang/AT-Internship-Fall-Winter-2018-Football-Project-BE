const Match = require('./../models/match.model');

module.exports = {
  selectAll: (callback) => {
    Match.find(callback);
  },
  createMatch: (body, callback) => {
    const match = new Match(body);
    match.save(callback);
  },
  getMatch: (id, callback) => {
    Match.find({_id: id}, callback);
  },
  updateMatch: (id, body, callback) => {
    Match.findByIdAndUpdate(id, body, callback);
  },
  deleteMatch: (id, callback) => {
    Match.deleteOne({_id: id}, callback);
  }
}
