'use strict';

const _ = require('lodash');
const api = global.mis.api;
const helper = require('../common/utils/helper');

const whiteList = [
    "usr/logout", "sessionidisvalid", "grade/gettraininfo", "grade/getgradeitemlist", "grade/submitscore",
    "grade/getscore", "grade/getscorelist", "file/create", "file/write", "file/querystatus",
    // 静态页面新闻页面
    "news/querynewstitle", "news/querynewsinfo", "usr/resetpasswordrequest", "usr/resetpassword",
    "evt/evtdetail","evt/evtsubmit", "usr/login",
    //报告
    "report/querypostreport","report/queryprereport",
    "conf/queryconflist",
    "learn/querylearninfo",
    "grade/querylearninfo",
    "grade/submitckscore",
    "report/querystudentckreport",
    "commparaconf/querycommparaconflist",	//系统参数配置
    "user/login",	//外训登录
    "user/register",	//外训注册
    "externaltrain/queryexternaltrainlist",
    "externaltrain/queryexternaltraininfo",
    "user/sendVerificationCode",
    "hr/querylevellist",//通用查询分类
    "deviceusage/deviceusagehis",
    "commonNaire/queryNaireInfo",
    "commonNaire/submitNaireResult",
    "wxmenu",
    "login",
    "report/czqxbj",
    "report/menpaidetail",
    "report/classreport",
    "qrcode/qrcodedetail", //二维码详情
	"health/healthtypelist", //舌尖上的健康 类型
    "health/allhealthlist", //舌尖上的健康 TV 前端显示列表
	"health/healthdetail" ,//详情
    "site/queryelecnameplate",
    "site/queryschedule",
    "medicine/list",
	"diseaseprevention/persontypelist", //疾病预防 人群类型
	"diseaseprevention/depttypelist", //疾病预防 科室类型
    "diseaseprevention/alldiseaselist", //疾病预防 TV 前端显示列表
	"diseaseprevention/diseasedetail",//详情,
	"diet/diettypelist", //互动饮食 类型
    "diet/alldietlist", //互动饮食 TV 前端显示列表
	"diet/dietdetail" ,//详情
	"commonNaire/dataAnalysis" ,//查询分析结果
	"drug/detail" ,//药品详情
	"drug/list" //药品列表
];

const NOLOGIN_HINT = {
    errcode: "9904",
    errdesc: "session invalid"
};

module.exports = (req, res, next) => {

    let param = req.body;
    let param1 = param['1'];
    let command = param1 && param1['command'];
    let loginid = param1 && param1['loginid'];
    let sessionid = param1 && param1['sessionid'];

    // 格式不对，没有包含 command
    if(!command) {
        return res.customJson({
            errcode: "1901",
            errdesc: "参数错误"
        });
    }

    // 白名单
    if(_.includes(whiteList, command)) {
        return next();
    }

    // 未登录
    if(!loginid || !sessionid) {
        return res.customJson(NOLOGIN_HINT);
    }

    helper.checkSession(loginid, sessionid)
        .then(ret => {
            if(ret && ret['1'] && ret['1']['errcode'] == '0') {
                return next();
            } else {
                return res.customJson(NOLOGIN_HINT);
            }
        })
        .catch(next);
};
