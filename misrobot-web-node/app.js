'use strict'

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const config = require('./sys-config');
const log4js = require('log4js');
// const RedisStore = require('connect-redis')(session);

const app = express();

// const redisStore = new RedisStore(config.redisOptions);
const mCookieParser = cookieParser('secret');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({
    type: ['application/json', 'text/plain', 'application/x-www-form-urlencoded', 'text/html']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session(config.cookieOptions))
/*app.use(session({
    store: redisStore,
    secret: 'secret'
}));*/

app.get('/pc/train-record-detail.html',function(req,res,next){
    res.redirect('/pages/ostp/train-record-detail.html?detail='+req.query.detail)
})
app.get('/pc/train-record-detail-devices.html',function(req,res,next){
    res.redirect('/pages/ostp/train-record-detail-devices.html?detail='+req.query.detail)
})
app.get('/skillcenter',function(req,res,next){
    res.redirect('/pages/scmp/login.html?detail='+req.query.detail)
})

app.use(express.static(path.join(__dirname, 'public'), {
    // index: false
}));
// vue 静态文件路径后有个/问题修复，html后有个/,找不到指定html
app.use('**.html/', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public', req.baseUrl));
});
app.use(timeout('60s'));



log4js.configure({
    appenders: [
        {type: 'console'}
        /*{type: 'console', category: 'web'},
        {type: 'console', category: 'api'},
        {type: 'console', category: 'health'}*/
    ],
    levels: { log_file: 'ALL', console: 'ALL', log_date: 'ALL' }
})

require('./common/bootstrap/BaseInit');
require('./common/bootstrap/registerHelpers');
app.use(require('./middleware/session-info'));
app.use(require('./middleware/json-result'));
app.use(require('./middleware/admin-session'));

require('./dispatch')(app);

/*app.post('/file/create',timeout('300s'), haltOnTimedout, function (req, res, next) {
  savePost(req.body, function (err, id) {
    if (err) return next(err)
    if (req.timedout) return
    res.send('saved as id ' + id)
  })
})

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

function savePost (post, cb) {
  setTimeout(function () {
    cb(null, ((Math.random() * 40000) >>> 0))
  }, (Math.random() * 7000) >>> 0)
}*/
// module.exports = app;
module.exports = {
    app: app,
    cookieParser: mCookieParser,
    // redisStore: redisStore
};
