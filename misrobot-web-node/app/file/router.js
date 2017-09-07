/**
 * Created by liuchuanyang on 2017/6/20.
 */
'use strict';
const timeout = require('connect-timeout');
const router = require('express').Router();
const file = require('./controller/file');

router.post('/upload', file.upload);
router.post('/upload4ckeditor', file.upload4ckeditor);
router.use('/upload4qrcode', file.upload4qrcode);
router.post('/create', file.create);
router.get('/list', file.list);

module.exports = router;
