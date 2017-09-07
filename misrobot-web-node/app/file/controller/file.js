/**
 * Created by liuchuanyang on 2017/6/20.
 */
'use strict';

const fs = require('fs');
const co = require('co');
const _ = require('lodash');
const log4js = require('log4js');
const logger = log4js.getLogger();
const md5 = require('md5');
const multiparty = require('multiparty');
const qr = require('qr-image');
const fdfs = global.mis.fdfs;
const api = global.mis.api;
const edmsApi = global.mis.edmsApi;

const fileService = require('../service/file');

const _upload = (req, fileName) => {
    
    let form = new multiparty.Form();
    let fName = fileName || 'file';
    
    return new Promise(function (resolve, reject) {
        try{
            form.parse(req, (err, fields, files) => {
            
                if(err) {
                    return reject(`上传失败：${err}`);
                }
            
                let file = _.get(files, `${fName}[0]`);

                if(!file || file.size <= 0) {
                    return reject(`上传文件不能为空！`);
                }
            
                fdfs.upload(file.path).then(fileId => {
                    return resolve({
                        fileId,
                        fields,
                        file
                    })
                }).catch(err => {
                    return reject(`上传失败：${err}`);
                });
            });
        } catch (e) {
            return reject(`上传失败！`);
        }
    });
};

/**
 * 仅仅上传，不记录文件表
 * @param req
 * @param res
 * @param next
 */
const upload = (req, res, next) => {
    
    return _upload(req).then(ret => {
        
        let fileId = _.get(ret, 'fileId');
        let rpath, group;
        
        if(fileId) {
            let idx = fileId.indexOf('/');
            group = fileId.substr(0, idx);
            rpath = fileId.substr(idx + 1);
        }
        
        return res.success({
            fullname: _.get(ret, 'file.originalFilename'),
            file_size: _.get(ret, 'file.size'),
            file_mimetype: _.get(ret, 'file.headers.content-type'),
            uri: fileId,
            fdfs_path: rpath,
            fdfs_group: group,
            url: fileService.getImageUrl(fileId)
        });
    }).catch(err => {
        return res.error(err);
    });
};

/**
 * 仅仅上传，返回ckeditor 格式的数据
 * @param req
 * @param res
 * @param next
 */
const upload4ckeditor = (req, res, next) => {
    
    return _upload(req, 'upload').then(ret => {
        
        let fileId = _.get(ret, 'fileId');
        let CKEditorFuncNum = req.query.CKEditorFuncNum || _.get(ret, 'fields.CKEditorFuncNum[0]');
        let rpath, group;
        
        if(fileId) {
            let idx = fileId.indexOf('/');
            group = fileId.substr(0, idx);
            rpath = fileId.substr(idx + 1);
        }
        
        let ckret = `<script>
                        window.parent.CKEDITOR.tools.callFunction(${CKEditorFuncNum}, '${fileService.getImageUrl(fileId)}', '') 
                     </script>`;
        res.status(200).send(ckret);
    }).catch(err => {
        return res.error(err);
    });
};

/**
 * 根据参数生成二维码图片并上传生成的图片
 * @param req
 * @param res
 * @param next
 */
const upload4qrcode = (req, res, next) => {
    
    let content = req.body.content || req.query.content;
    let size = req.body.size || req.query.size || 5;
    let margin = req.body.margin || req.query.margin || 2;

    if(!content) {
        return res.error('生成二维码内容不能为空');
    }
    let qrPng = qr.imageSync(content, {
        size: Number(size),
        margin: Number(margin)
    });
    
    fdfs.upload(qrPng, {
        ext: 'png'
    }).then(fileId => {
    
        let rpath, group;
    
        if(fileId) {
            let idx = fileId.indexOf('/');
            group = fileId.substr(0, idx);
            rpath = fileId.substr(idx + 1);
        }
    
        return res.success({
            uri: fileId,
            fdfs_path: rpath,
            fdfs_group: group,
            url: fileService.getImageUrl(fileId)
        });
    }).catch(err => {
        return res.error(`上传失败：${err}`);
    });
};

/**
 * 上传文件，并记录入业务表记录，云盘里可以看到
 * @param req
 * @param res
 * @param next
 */
const create = (req, res, next) => {
    
    return _upload(req).then(ret => {
        
        let fileId = _.get(ret, 'fileId');
        let rpath, group;
        
        if(fileId) {
            let idx = fileId.indexOf('/');
            group = fileId.substr(0, idx);
            rpath = fileId.substr(idx + 1);
        }

        return edmsApi.post('courseware/savepath',
            { "1" : {
                command: 'courseware/savepath',
                sessionid: _.get(ret, 'fields.sessionid[0]'),
                loginid: _.get(ret, 'fields.loginid[0]'),
                parent_id:_.get(ret,'fields.parent_id[0]'),
                uid: _.get(ret, 'fields.loginid[0]'),
                fullname: _.get(ret, 'file.originalFilename'),
                file_size: _.get(ret, 'file.size'),
                file_mimetype: _.get(ret, 'file.headers.content-type'),
                fdfs_path: rpath,
                fdfs_group: group
            } }
        ).then(ret => {
            return res.success(ret && ret['1']);
        });

    }).catch(err => {
        return res.error(err);
    });
};

const list = (req, res, next) => {
    res.render('test-temp/files', {
        list: []
    });
};

module.exports = {
    create,
    upload,
    upload4ckeditor,
    upload4qrcode,
    list
};
