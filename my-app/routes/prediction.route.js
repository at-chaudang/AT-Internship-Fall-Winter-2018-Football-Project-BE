const express = require('express');
const router = express.Router();
const predictioneCtrl = require('../controllers/prediction.controller');

router.get('/', predictioneCtrl.index);
router.post('/new', predictioneCtrl.new);
router.get('/:id', predictioneCtrl.show);
router.get('/match/:id', predictioneCtrl.showByIdMatch);
router.patch('/:id', predictioneCtrl.update);
router.delete('/:id', predictioneCtrl.delete);

module.exports = router;
