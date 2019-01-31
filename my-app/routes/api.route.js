const express = require('express');
const router = express.Router();

const sessionCtrl = require('../controllers/session.controller');

router.post('/authenticate', sessionCtrl.login);
router.post('/register', sessionCtrl.register);

module.exports = router;
