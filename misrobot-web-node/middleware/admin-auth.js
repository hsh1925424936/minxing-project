'use strict';

const _ = require('lodash');

module.exports = (req, res, next) => {
    if (_.isEmpty(req.session.admin) && _.isEmpty(req.session.user)) {
        if (req.xhr) {
            return res.error('抱歉，您尚未登录！', 1111);
        } else {
            return res.redirect('/adminlogin');
        }
    }

    next();
};
