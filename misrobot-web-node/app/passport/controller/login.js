/**
 * Created by liuchuanyang on 2017/6/27.
 */
'use strict';

const _ = require('lodash');
const passport = require('passport');
const uuid = require('uuid');
const log4js = require('log4js');
const log = log4js.getLogger();

const loginService = require('../service/login');

// 第三方登录回调
function doPassportCallback(req, res, user) {
    
    // 第三方登录不能正确跳转：把需要跳转的链接拿出来

    if (user.openid) {
        user.nickname = _.trim(user.nickname);
        
        /*if (user.sourceType === 'weixin') {
            // PC 的微信登录使用unionId
            user.openId = user.unionId;
        }*/
        let data ={};
       
        
        return loginService.signinByOpenID(user)
            .then((result) => {
                if (result.errcode != 0) {
                    return res.render('login-result',{ result:1,type:req.query.state});
                } else {

                    if(req.query.state==1){//自主学习
                        res.cookie('gy_un',result.username);
                        res.cookie('gy_n',strtocode(result.name));
                        res.cookie('gy_a',user.headimgurl);
                        res.cookie('gy_t',result.sessionid)
                        res.cookie('gy_u',result.userid)
                        return res.redirect('/pages/ostp/self-train.html');
                    }else if(req.query.state==2){//同伴互助
                         let data = {nickname:result.name,headimgurl:result.headimgurl,username:result.username,password:result.password};
                         
                        return res.render('login-result',{user:data,type:2,help:true})
                    }else if(req.query.state==3){//osce
                        let data = {"command":"osceexamexaminee/addosceexamexaminee","examineeid": result.userid};
                        return loginService.addOsceUser(data).then((resp)=>{
                           
                            if(resp.errcode!=0){
                                return res.render('login-result',{ result: 1,type:3,osce:true});
                            }else{
                                return res.render('login-result',{user:resp,type:3});
                            }
                        }).catch(()=>{
                            return res.render('login-result',{ result: 1,type:req.query.state});
                        })
                    }else if(req.query.state==4){//智能设备u3d
                        let data={result:"1",token:result.sessionid,user_id:result.userid,name:result.name,username:result.username};
                        return res.render('login-result',{user:data,type:4});
                    }else if (req.query.state ==5){
                        return res.redirect('http://localhost:8088/username='+result.username+'&pwd='+result.password+'&nickname='+result.name);
                    }
                }
                return res.render('login-result', { user: result });
            }).catch(()=>{
                return res.render('login-result',{ result: 1,type:req.query.state});
            });
    } else {
        return res.render('login-result',{ result: 1,type:req.query.state});
        //return Promise.resolve(res.redirect('/passport/login'));
    }
}
function strtocode(str) {
    var _arr = str.split("");
    var _arr2 = [];
    for (var i = 0; i<_arr.length; i++) {
        _arr2.push(_arr[i].charCodeAt());
    }
    var _str2 = _arr2.join("&");
    return _str2;
}
const weixin = {
    login: (req, res, next) => {
        //req.session.type = req.query.type;
        req.session.authState = req.query.type;

        return passport.authenticate('weixin', {
            state: req.session.authState
        })(req, res, next);
    },
    callback: (req, res, next) => {

        //if (req.session && req.session.authState && req.session.authState === req.query.state) {
            passport.authenticate('weixin', (err, user) => {
                
                if (err) {
                    log.error(`wechat authenticate error : ${JSON.stringify(err)}`);
                    return res.render('login-result',{ result: 1,type:req.query.state});
                } else {
                    doPassportCallback(req, res, {
                        openid: user._json.openid,
                        unionid: user._json.unionid || user.id,
                        nickname: user._json.nickname || user.displayName,
                        sex:user._json.sex,
                        language:user._json.language,
                        city:user._json.city,
                        province:user._json.province,
                        country:user._json.country,
                        headimgurl:user._json.headimgurl,
                        privilege:user._json.privilege.join(','),
                        command:'user/scancode',
                        source: 'wx',
                        type:'website'
                        //rawUser: user
                    }).catch(next);
                }
            })(req, res, next);
       /*[ } else {
                   return next(new Error('Wechat Auth State Mismatch'));
               }]*/
    }
};

const loginPage = (req, res, next) => {
    return res.render('login');
};

module.exports = {
    weixin,
    loginPage
};
