const mongoose = require('mongoose');

const roundSchema = mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  start_at: {
    type: Date,
    required: false
  },
  end_at: {
    type: Date,
    required: false
  }
});

module.exports = mongoose.model('Round', roundSchema);
