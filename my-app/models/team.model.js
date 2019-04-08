const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: false
  },
  cover: {
    type: String,
    require: false
  },
  logo: {
    type: String,
    require: false
  }
});

module.exports = mongoose.model('Team', teamSchema);
