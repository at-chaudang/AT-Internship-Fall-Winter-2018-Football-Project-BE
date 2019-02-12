const Prediction = require('./../models/prediction.model');

module.exports = {
  selectAll: (callback) => {
    Prediction.find(callback); 
  },
  createPrediction: (body, callback) => {
    try {
      const prediction = new Prediction(body);
      prediction.save(callback);
    } catch (err) {
      console.log(err);
    }
  },
  getPrediction: (id, callback) => {
    Prediction.find({_id: id}, callback);
  },
  updatePrediction: (id, body, callback) => {
    Prediction.findByIdAndUpdate(id, body, callback);
  },
  deletePrediction: (id, callback) => {
    Prediction.deleteOne({_id: id}, callback);
  },
  getPredictionByIdMatch: (match_id, callback) =>{
    Prediction.find({match_id: match_id},callback);
  }
}
