/**
 * Created by liuchuanyang on 2017/5/27.
 */

const captchapng = require('captchapng');
const _ = require('lodash');
const path = require('path');
const api = global.mis.api;
const edmsApi = global.mis.edmsApi;

const sysconfig = require('../../../sys-config');
const log4js = require('log4js');
const log = log4js.getLogger();

const main = (req, res, next) => {
    
    let param = req.body; // JSON.parse(req.body);
    // let query = req.query;

    log.info(`----> web sys core action begin. params: ${JSON.stringify(param)}`);
    if(!param.command && (!param['1'] || !param['1'].command)) {
        log.error(`request params error.`);
        return res.customJson({
            errcode: "1901",
            errdesc: "参数错误"
        });
    }
    
    api.post(param['1']['command'], param).then(ret => {
    
        log.info(`----> web sys core action end. result: ${JSON.stringify(ret)}`);
        return res.send(ret);
    });
};

const onlinesrc = (req, res, next) => {
    
    let param = req.body; // JSON.parse(req.body);
    // let query = req.query;
    
    log.info(`----> edmsApi web sys core action begin. params: ${JSON.stringify(param)}`);
    if(!param.command && (!param['1'] || !param['1'].command)) {
        log.error(`request params error.`);
        return res.customJson({
            errcode: "1901",
            errdesc: "参数错误"
        });
    }
    
    edmsApi.post(param['1']['command'], param).then(ret => {
        
        log.info(`----> edmsApi web sys core action end. result: ${JSON.stringify(ret)}`);
        return res.send(ret);
    });
};

const captcha = (req, res, next) => {
    
    let code = parseInt(Math.random()*9000+1000);
    let p = new captchapng(80, 30, code); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    
    let img = p.getBase64();
    let imgbase64 = new Buffer(img,'base64');
    
    req.session.captcha = code;

    res.set('Content-Type', 'image/png');
    res.end(imgbase64); //.status(200)
};

const welcome = (req, res, next) => {
    res.sendFile(path.join(sysconfig.base_path + '/public/pages/homepage/login.html'));
};

module.exports = {
    main,
    onlinesrc,
    captcha,
    welcome
};
