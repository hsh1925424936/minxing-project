'use strict';

const fs = require('fs');
const co = require('co');
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger();
const md5 = require('md5');
const multiparty = require('multiparty');

const fileService = require('./file');

const FdfsClient = require('fdfs');

const fdfs = new FdfsClient({
    // tracker servers
    trackers: [
        {
            host: '192.168.32.100',
            port: 22122
        }
    ],
    // 默认超时时间10s
    timeout: 10000,
    // 默认后缀
    // 当获取不到文件后缀时使用
    defaultExt: 'txt',
    // charset默认utf8
    charset: 'utf8'
});

const query = (req, res, next) => {
    
    req.session.hello = 'world';
    fileService.query({
        
    }).then(list => {
        res.render('index', {
            list: list
        });
    });
};

const toAddDirPage = (req, res, next) => {
    fileService.query({
        
    }).then(list => {
        res.render('dirs', {
            list: list
        });
    });
};

const addFile = (req, res, next) => {

    let form = new multiparty.Form();
    
    try{
    form.parse(req, (err, fields, files) => {

        if(err) {
            console.log('上传失败！');
            return res.render('index');
        }
        
        let file1 = files['file'][0];
        let parent_id = fields['parent_id'][0] || 0;
        let name = file1.originalFilename;
        let size = file1.size;
        
        console.log('=====================>>>>>>>>> ');
        if(file1 && file1.size > 0) {
            fdfs.upload(file1.path).then(fileId => {
                
                fileService.addFile({
                    parent_id: parent_id,
                    uri: fileId,
                    name: name,
                    size: size
                });
                console.log(fileId);
                res.redirect('/index');
            }).catch(err => {
                console.log(err);
                res.render('index', {
                    msg: '上传失败！'
                });
            });
        }
    });
    
    } catch (e) {
        console.log(e);
    }
};

const addDir = (req, res, next) => {
    fileService.addDir({
        name: req.body.name,
        parent_id: req.body.parent_id
    }).then(ret => {
        res.redirect('/index');
    });
};


module.exports = {
    addFile,
    addDir,
    query,
    toAddDirPage
};
