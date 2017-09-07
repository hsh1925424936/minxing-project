/**
 * Created by liuchuanyang on 2017/6/2.
 */

'use strict';

const _ = require('lodash');

module.exports = (req, res, next) => {
    res.locals['_s'] = req.session;
    next();
};
