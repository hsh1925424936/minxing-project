'use strict';

const router = require('express').Router();
const medicine = require('./controller/medicine');

router.use('/show', medicine.show);
router.use('/reset',medicine.reset);

module.exports = router;
