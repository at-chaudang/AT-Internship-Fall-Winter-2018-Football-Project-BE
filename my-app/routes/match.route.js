const express = require('express');
const router = express.Router();

const matchCtrl = require('../controllers/match.controller');

router.get('/', matchCtrl.index);
router.get('/create', matchCtrl.new);
router.get('/showDonePercentMatches', matchCtrl.showDonePercentMatches);
router.get('/next-match', matchCtrl.showNextMatch);
router.get('/:id', matchCtrl.show);
router.get('/show/:tournamentId', matchCtrl.showAllByTournament);
router.get('/showTopTeams/:tournamentId', matchCtrl.showTopTeamsByTournament);
router.get('/tournament/:tournamentId', matchCtrl.showBracketByTournament);
router.post('/update', matchCtrl.update);
router.post('/:id', matchCtrl.deleteByTournament);

module.exports = router;
