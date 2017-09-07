/**
 * Created by liuchuanyang on 2017/6/20.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger();
const md5File = require('md5-file/promise');

const sysConfig = require('../../../sys-config');

/**
 * 获取用户信息
 * @param req
 * @param res
 * @param next
 */
const getFileInfo = (req, res, next) => {

    let param = req.body;
    let param1 = param['1'];
    let filename = param1 && param1['filename'];

    if(!filename) {
        return res.customJson({
            errcode: "1901",
            errdesc: "参数错误"
        });
    }

    let fpath = path.join(sysConfig.base_path, '/public/zipfile/' + filename);

    fs.stat(fpath, (err, stat) => {
        if(err) {
            res.customError(9999, '读取文件错误。');
        } else {
            md5File(fpath).then(hash => {
                res.customSuccess({
                    command:'autoupgrade/getfileinfo',
                    filesize: stat.size + '',
                    filemd5: hash
                });
            }).catch(err => {
                res.customError(9999, err);
            });
        }
    });
};

module.exports = {
    getFileInfo
};
