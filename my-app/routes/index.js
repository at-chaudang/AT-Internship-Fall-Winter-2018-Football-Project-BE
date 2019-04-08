const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const matchRouter = require('./match.route');
const apiRouter = require('./api.route');
const tournamentRouter = require('./tournament.route');
const predictionRouter = require('./prediction.route');
const tournamentTeamRouter = require('./tournament_team.route');
const teamRouter = require('./team.route');
const statictisRouter = require('./statistics.route');
const homeRouter = require('./home.route');
const scheduleRouter = require('./schedule.route');

const verifyToken = require('../middleware/verifyToken');

// router.get('/', (req, res) => {
//   // res.redirect('/matchs');
// });

router.use('/', apiRouter);
router.use('/users', verifyToken, userRouter);
router.use('/home', homeRouter);
router.use('/schedules', scheduleRouter);
router.use('/matches', matchRouter);
router.use('/tournaments', tournamentRouter);
router.use('/predictions', predictionRouter);
router.use('/tournamentTeams', tournamentTeamRouter);
router.use('/teams', teamRouter);
router.use('/statistics', statictisRouter);

module.exports = router;
