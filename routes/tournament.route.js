const express = require('express');
const router = express.Router();

const tournamentCtrl = require('../controllers/tournament.controller');

router.get('/', tournamentCtrl.index);
router.post('/', tournamentCtrl.new);
router.get('/:id', tournamentCtrl.show);
router.patch('/:id', tournamentCtrl.update);
router.delete('/:id', tournamentCtrl.delete);

module.exports = router;
