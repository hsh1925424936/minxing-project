/**
 * Created by liuchuanyang on 2016/12/17.
 */
'use strict'


const isProduction = process.env.NODE_ENV === 'production'
const isDevelop = process.env.NODE_ENV === 'dev'

module.exports = {
    app: 'test',
    appVersion: 'v.2.6.1_20170905',
    debug: true,
    port: 6001,
    isProduction: isProduction,
    isDevelop: isDevelop,

    base_path: __dirname, //应用根路径，程序中常用
    view_dir : 'views',
    upload: {
        base_path: 'public/',
        dir: 'upload',
        param: {
            max: 1024*1024*10
        }
    },
    script_ext: ".js", //编程用的脚本后缀
    tpl_ext: '.hbs',
    assets_head: "/assets",
    auth_cookie_name: 'misrobot',
    cookieOptions: {
        name: 'misrobot_session',
        secret: 'misrobot;=+3.1414926',
        cookie: {
            expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        }
    },
    domains: {
        api: 'http://192.168.1.200/misrobot-service/',
        edmsApi: 'http://192.168.1.200:8088/misrobot-edms/',
        timeout: 6000       //访问业务层接口超时时间 默认6s
    },
    redisOptions: {
        host: '127.0.0.1',
        port: 6379
    },
    auth: {
        weixin: {
            app_id:"wxa9dfc670bf63ffe6",
            app_secret:"a71fc295e463aaccb8e55bd3a26d44d8",
            redirect_uri : 'http://misinfo.misrobot.com/passport/auth/weixin/callback'
        }
    },
    fdfs: {
        enable: true,
        getBase: 'http://192.168.1.200',
        upload: {
            // tracker servers
            trackers: [{
                host: '192.168.1.200',
                port: 22122
            }],
            // 默认超时时间10s
            timeout: 10000,
            // 默认后缀, 当获取不到文件后缀时使用
            defaultExt: 'txt',
            // charset默认utf8
            charset: 'utf8'
        }
    },
    //如果需要使用mysql，则去掉mysql_config的注释并修改为自己的数据库信息
    //如果需要使用mongo，则去掉mongo_config的注释并修改为自己的配置。
    post_interval: 2000    //表单提交最小间隔时间，防止重复提交
};
