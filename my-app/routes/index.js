const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const matchRouter = require('./match.route');
const apiRouter = require('./api.route');
const tournamentRouter = require('./tournament.route');

const utilities = require('../utilities/index');

router.get('/', (req, res) => {
  res.redirect('/schedules');
});

router.use('/users', utilities.verifyToken, userRouter);
router.use('/matchs', matchRouter);
router.use('/api', apiRouter);
router.use('/tournaments', tournamentRouter);

module.exports = router;
