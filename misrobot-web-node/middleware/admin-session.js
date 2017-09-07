'use strict';

const _ = require('lodash');

module.exports = (req, res, next) => {

    if (req.session && !_.isEmpty(req.session.admin)) {
        req.admin = req.session.admin;
    }
    
    next();
};

