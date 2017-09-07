'use strict';

const router = require('express').Router();
const index = require('./controller/index');

const loginCheck = require('../../middleware/login-check');


router.get(['', '/'], index.welcome);
router.post('/onlinesrc/**', loginCheck, index.onlinesrc);
router.post('/courseware/**', loginCheck, index.onlinesrc);
router.post('/**', loginCheck, index.main);

module.exports = router;
