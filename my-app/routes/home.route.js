const express = require('express');
const router = express.Router();

const homeCtrl = require('../controllers/home.controller');

router.get('/', homeCtrl.index);

module.exports = router;
