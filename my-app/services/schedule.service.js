const Schedule = require('../models/schedule.model');
const utilities = require('../utilities/index');

module.exports = {
  selectAll: (callback) => {
    Schedule.find(callback);
  },
  createSchedule: (body, callback) => {
    let data = JSON.parse(body.data);
    console.log(data);
    let { tournamentId, schedules } = data;

    schedules.map(pair => {
      pair.map(item => {
        let schedule = new Schedule({
          tournament: tournamentId,
          group: item[0],
          firstTeam: item[1],
          secondTeam: item[2],
          matchDate: item[3]
        });
        schedule.save(err => {
          if (err) throw err;
        });
      });
    });

    callback(null, data);
  },
  getSchedule: (id, callback) => {
    Schedule.find({ _id: id }, callback);
  },
  updateSchedule: (id, body, callback) => {
    Schedule.findByIdAndUpdate(id, body, callback);
  },
  deleteSchedule: (id, callback) => {
    Schedule.deleteOne({ _id: id }, callback);
  }
}
