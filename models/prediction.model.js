const mongoose = require('mongoose');

const predictionSchema = mongoose.Schema({
  match_id: {
    type: Schema.Types.ObjectId,
    ref: 'Score'
  },
  date: {
    type: Date
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  scorePrediction: {
    type: String,
    required: false
  }
}, {strict: false});

module.exports = mongoose.model('Prediction', predictionSchema);
