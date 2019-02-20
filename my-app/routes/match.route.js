const express = require('express');
const router = express.Router();

const matchCtrl = require('../controllers/match.controller');

router.get('/', matchCtrl.index);
router.get('/create', matchCtrl.new);
router.get('/next-match', matchCtrl.showNextMatch);
router.get('/:id', matchCtrl.show);
router.get('/show/:tournamentId', matchCtrl.showAllByTournament);
router.get('/tournament/:tournamentId', matchCtrl.showBracketByTournament);
router.patch('/:id', matchCtrl.update);
router.delete('/:id', matchCtrl.delete);

module.exports = router;
