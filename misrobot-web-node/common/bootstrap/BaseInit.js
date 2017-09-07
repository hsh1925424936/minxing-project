/**
 * 接口公共方法
 * @author: liuchuanyang
 * @date: 2017/3/16
 */

'use strict';

const config = require('../../sys-config.js');
const Api = require('../utils/api.js');
const path = require('path');
const _ = require('lodash');
const FdfsClient = require('fdfs');

global.mis = {};

global.mis.api = new Api(config.domains.api, {
    name: 'api',
    timeout: config.domains.timeout
});

global.mis.edmsApi = new Api(config.domains.edmsApi, {
    name: 'edmsApi',
    timeout: config.domains.timeout
});

if(config && config.fdfs && config.fdfs.enable === true) {
    global.mis.fdfs = new FdfsClient(config.fdfs.upload);
}

global._ws = global._ws || {};
