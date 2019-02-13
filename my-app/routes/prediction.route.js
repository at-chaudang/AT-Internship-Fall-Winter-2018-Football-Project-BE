const express = require('express');
const router = express.Router();
const predictionCtrl = require('../controllers/prediction.controller');

router.get('/', predictionCtrl.index);
router.post('/new', predictionCtrl.new);
router.get('/:id', predictionCtrl.show);
router.get('/match/:id', predictionCtrl.showByIdMatch);
router.patch('/:id', predictionCtrl.update);
router.delete('/:id', predictionCtrl.delete);

module.exports = router;
