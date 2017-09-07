/**
 * Created by liuchuanyang on 2017/5/27.
 */
'use strict';

const fs = require('fs');
const co = require('co');
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger();
// const md5 = require('MD5');
const api = global.mis.api;

const config = require('../../../sys-config.js');

/**
 * 通过uri 获取url
 * @param uri
 */
const getImageUrl = (uri, group) => {
    let arr = [config.fdfs.getBase];
    
    if(group) {
        arr.push(group);
    }

    arr.push(uri);
    
    return arr.join('/');
};

module.exports = {
    getImageUrl
};
