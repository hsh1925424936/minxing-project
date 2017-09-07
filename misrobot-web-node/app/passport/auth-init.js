/**
 * passport 验证策略注册
 * @author: liuchuanyang<liuchuanyangnj@misrobot.com>
 * @date: 2017/6/27
 */

'use strict';
const _ = require('lodash');
const passport = require('passport');
const WeixinStrategy = require('passport-weixin');
const config = require('../../sys-config');


/**
 * 微信登录
 */
passport.use('weixin', new WeixinStrategy({
    clientID: config.auth.weixin.app_id,
    clientSecret: config.auth.weixin.app_secret,
    callbackURL: config.auth.weixin.redirect_uri,
    requireState: true,
    scope: 'snsapi_login'
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));
