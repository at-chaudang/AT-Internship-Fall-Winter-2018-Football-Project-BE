const express = require('express');
const router = express.Router();

const scheduleCtrl = require('../controllers/schedule.controller');

router.post('/set-knockout', scheduleCtrl.setKnockout);

module.exports = router;
