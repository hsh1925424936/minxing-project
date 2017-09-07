'use strict';

const express = require('express');
const passport = require('passport');
const login = require('./controller/login');

const router = express.Router(); // eslint-disable-line

require('./auth-init');
router.use(passport.initialize());
router.use(passport.session());

router.get('/passport/login', login.loginPage);

// 微信登录
router.get('/passport/auth/weixin', login.weixin.login);
router.get('/passport/auth/weixin/callback', login.weixin.callback);

module.exports = router;
