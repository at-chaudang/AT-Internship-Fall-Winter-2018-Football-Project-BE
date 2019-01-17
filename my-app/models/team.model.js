const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  num: {
    type: Number,
    required: false
  },
  code: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Team', teamSchema);
