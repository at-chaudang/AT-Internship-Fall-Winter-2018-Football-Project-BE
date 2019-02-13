const express = require('express');
const router = express.Router();

const userRouter = require('./user.route');
const matchRouter = require('./match.route');
const apiRouter = require('./api.route');
const tournamentRouter = require('./tournament.route');
const predictionRouter = require('./prediction.route');

const verifyToken = require('../middleware/verifyToken');

// router.get('/', (req, res) => {
//   // res.redirect('/matchs');
// });

router.use('/', apiRouter);
router.use('/users', verifyToken, userRouter);
router.use('/matches', matchRouter);
router.use('/tournaments', tournamentRouter);
router.use('/predictions', predictionRouter);

module.exports = router;
