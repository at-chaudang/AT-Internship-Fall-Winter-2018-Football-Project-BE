const express = require('express');
const router = express.Router();

const teamCtrl = require('../controllers/team.controller');

router.get('/', teamCtrl.index);
router.post('/', teamCtrl.new);
router.get('/:id', teamCtrl.show);
router.patch('/:id', teamCtrl.update);
router.delete('/:id', teamCtrl.delete);

module.exports = router;
