/**
 * Created by liuchuanyang on 2017/8/10.
 */
'use strict';

const router = require('express').Router();
const index = require('./controller/index');

router.post('/getfileinfo', index.getFileInfo);

module.exports = router;
