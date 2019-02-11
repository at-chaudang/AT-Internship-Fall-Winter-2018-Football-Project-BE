const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Team', teamSchema);
