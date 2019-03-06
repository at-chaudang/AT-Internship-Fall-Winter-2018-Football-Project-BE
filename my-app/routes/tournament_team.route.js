const express = require('express');
const router = express.Router();

const tournamentTeamCtrl = require('../controllers/tournament_team.controller');

router.get('/:id', tournamentTeamCtrl.index);
// router.post('/new', tournamentTeamCtrl.new);
// router.get('/:id', tournamentTeamCtrl.show);

module.exports = router;
