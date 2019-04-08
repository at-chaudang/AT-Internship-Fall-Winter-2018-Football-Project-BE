const express = require('express');
const router = express.Router();

const tournamentTeamCtrl = require('../controllers/tournament_team.controller');

router.get('/:id', tournamentTeamCtrl.show);
// router.detele('/:id', tournamentTeamCtrl.index);

module.exports = router;
