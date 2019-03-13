const express = require('express');
const router = express.Router();
const statisticCtrl = require('../controllers/statistics.controller');

router.get('/', statisticCtrl.index);

module.exports = router;
