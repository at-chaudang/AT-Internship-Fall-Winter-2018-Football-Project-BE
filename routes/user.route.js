const express = require('express');
const router = express.Router();

const userCtrl = require('./../controllers/user.controller');

router.get('/', userCtrl.index);
router.post('/', userCtrl.new);
router.get('/:id', userCtrl.show);
router.patch('/:id', userCtrl.update);
router.delete('/:id', userCtrl.delete);

module.exports = router;
