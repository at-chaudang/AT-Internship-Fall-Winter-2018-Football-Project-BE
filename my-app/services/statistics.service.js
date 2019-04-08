const Team = require('../models/team.model');
const Match = require('../models/match.model');

var CurrntMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",];
var data = {
  label: [],
};
// for (let i = 0; i < 12; i++) {
//   data.label.push(i);
// }

let result = [];
const year = (new Date()).getFullYear();
let date;
module.exports = {
  statisticMatch: (callback) => {
    Match.find(
      {
        start_at: { $lt: (year + 1 + ''), $gt: (year - 1 + '') }
      })
      .sort({ start_at: 1 })
      .then(
        array => {
          result = [];
          for (let m = 2; m <= 7; m++) {
            date1 = new Date(`${year}-${m}`);
            date2 = new Date(`${year}-${m - 1}`);
            result.push(
              (array.filter(x => {
                return (
                  (x.start_at < date1 && x.start_at > date2)
                )
              }).length)
            );          
          }
          callback(null, result);
        }
      )
  },
  createTeam: (body, callback) => {
    const team = new Team(body);
    team.save(callback);
  },
  getTeam: (id, callback) => {
    Team.findOne({ _id: id }, callback);
  },
  updateTeam: (id, body, callback) => {
    Team.findByIdAndUpdate(id, body, callback);
  },
  deleteTeam: (id, callback) => {
    Team.deleteOne({ _id: id }, callback);
  }
}
