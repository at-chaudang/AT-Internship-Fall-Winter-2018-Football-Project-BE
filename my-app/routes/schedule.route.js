const express = require('express');
const router = express.Router();

const scheduleCtrl = require('../controllers/schedule.controller');

const utilities = require('../utilities/index');

router.get('/', scheduleCtrl.index);
router.get('/new', scheduleCtrl.new);
router.get('/:id', scheduleCtrl.show);
router.patch('/:id', utilities.verifyToken, scheduleCtrl.update);
router.delete('/:id', utilities.verifyToken, scheduleCtrl.delete);

module.exports = router;
