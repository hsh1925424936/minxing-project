/**
 * Created by liuchuanyang on 2016/12/22
 */
'use strict'

const _ = require('lodash');
const log4js = require('log4js');
const moment = require('moment');
const logger = log4js.getLogger();
const api = global.mis.api;

module.exports = {
    checkSession: (uid, sessionid) => {
        let command = "usr/sessionidisvalid";
        
        return api.post(command, {
            "1" : {
                command: command,
                uid: uid,
                sessionid: sessionid
            }
        });
    }
};
